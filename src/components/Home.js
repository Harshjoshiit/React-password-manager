import React, { useEffect, useState } from 'react';
import { onSnapshot, collection, doc, updateDoc, setDoc } from 'firebase/firestore';
import BasicModal from './Modal';
import PasswordModal from './PasswordModal';
import { AiFillEye } from "react-icons/ai";
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Home({ database }) {
    let auth = getAuth();
    let navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [PassOpen, setPassOpen] = useState(false);
    const [showPassword, setshowPassword] = useState({});
    const handlePassClose = () => {
        setPassOpen(false);
        // Reset the password view state when closing the modal
        setshowPassword({});
    };
    
    const [passwordsArray, setpasswordsArray] = useState([]);
    const [oldPassword, setoldPassword] = useState([]);
    
    // Get current user's passwords only
    const getPasswords = () => {
        if (!auth.currentUser) {
            console.log("No user logged in");
            return;
        }
        
        const userId = auth.currentUser.uid;
        const userDocRef = doc(database, 'userPasswords', userId);
        
        onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setoldPassword(data.passwordsArray || []);
                setpasswordsArray([{
                    id: userId,
                    passwordsArray: data.passwordsArray || []
                }]);
                console.log("Retrieved passwords for", userId);
            } else {
                setoldPassword([]);
                setpasswordsArray([]);
                console.log("No passwords found for", userId);
            }
        });
    };

    const openPasswordModal = (name, password) => {
        setPassOpen(true);
        setshowPassword({
            name: name,
            password: password
        });
    };

    const addPasswords = async (passwordObject) => {
        if (!passwordObject.name || !passwordObject.password) {
            console.warn("Password details are incomplete");
            return;
        }

        if (!auth.currentUser) {
            console.error("No authenticated user found");
            return;
        }

        const userId = auth.currentUser.uid;
        const userDocRef = doc(database, 'userPasswords', userId);

        try {
            await setDoc(userDocRef, {
                email: auth.currentUser.email,
                passwordsArray: [...oldPassword, passwordObject]
            }, { merge: true });

            console.log('Password added to Firestore for user:', userId);
            handleClose();
        } catch (error) {
            console.error('Error adding password:', error);
        }
    };

    const handleLogout = () => {
        signOut(auth)
        .then(() => {
            console.log("Sign out successful");
            sessionStorage.clear();
            // Clear state on logout
            setpasswordsArray([]);
            setoldPassword([]);
            navigate('/');
        })
        .catch((error) => {
            console.error("Error during logout:", error);
        });
    };

    useEffect(() => {
        // Ensure passwords are loaded whenever user changes
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                console.log("User authenticated:", user.uid);
                getPasswords();
            } else {
                console.log("User not authenticated");
                setpasswordsArray([]);
                setoldPassword([]);
            }
        });
        
        return () => unsubscribe();
    }, []);

    return (
        <div className='home-main'>
            <div className='logout-btn'>
                <button className='input-btn' onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <h1>Home</h1>
            <div className='card-main'>
                <button className='input-btn add-password' onClick={handleOpen}>
                    Add a password
                </button>
                <div className="password-main">
                    {passwordsArray.map((password) => (
                        <React.Fragment key={password.id}>
                            {password.passwordsArray?.map((pwd, index) => (
                                <div className="password-data" key={index}>
                                    <p className='password-display'>{pwd.name}</p>
                                    <AiFillEye size={30} className='eye-icon' onClick={() => openPasswordModal(pwd.name, pwd.password)} />
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <BasicModal
                open={open}
                handleClose={handleClose}
                addPasswords={addPasswords}
            />
            <PasswordModal
                open={PassOpen}
                handleClose={handlePassClose}
                showPassword={showPassword}
            />
        </div>
    );
}



