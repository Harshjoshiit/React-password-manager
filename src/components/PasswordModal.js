import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';  
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseCircle } from "react-icons/io5";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PasswordModal({
  open,
  handleClose,
  showPassword
}) {
    const [newPassword, setnewPassword] = useState('');
    const [ShowthePassword, setShowthePassword] = useState(false);
    
    // Check if user is already validated
    useEffect(() => {
        if (open && sessionStorage.getItem('passwordValidated') === 'true') {
            setShowthePassword(true);
        } else {
            setShowthePassword(false);
        }
    }, [open]);
    
    // Reset password input when modal closes
    const onModalClose = () => {
        setnewPassword('');
        // Don't reset ShowthePassword here
        handleClose();
    };
    
    const ValidatePassword = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            toast.error("You must be logged in");
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, newPassword);

        reauthenticateWithCredential(user, credential)
        .then(() => {
            // Set validated flag in session storage
            sessionStorage.setItem('passwordValidated', 'true');
            setShowthePassword(true);
            toast.success("Password Validated");
        })
        .catch((error) => {
            console.error("Authentication error:", error);
            toast.error("Please enter the correct password.");
        });
    };
    
    return (
        <div>
            <ToastContainer/>
            <Modal
                open={open}
                onClose={onModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='model-main'>
                    <IoCloseCircle className='close' onClick={onModalClose} style={{ cursor: 'pointer' }} />
                    
                    {ShowthePassword ? (
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            The password of {showPassword.name} is {showPassword.password}.
                        </Typography>
                    ) : (
                        <>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                                Verify your identity
                            </Typography>
                            <input 
                                placeholder='Enter your login password'
                                className='input-fields-modal'
                                onChange={(event) => setnewPassword(event.target.value)}
                                name='password'
                                type='password'
                                value={newPassword}
                                autoComplete="new-password" // Prevent autocomplete
                            />
                            <button 
                                className='input-fields-modal input-btn' 
                                onClick={ValidatePassword}
                                disabled={!newPassword}
                            >
                                Validate
                            </button>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}