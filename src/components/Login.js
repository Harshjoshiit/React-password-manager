import React, { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const [loginData, setLoginData] = useState({});
  const auth = getAuth();
  let navigate = useNavigate();

  const onInput = (event) => {
    let data = { [event.target.name]: event.target.value };
    setLoginData({ ...loginData, ...data });
  };

  const login = () => {
    signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      .then(() => {
        // Clear previous user session data if needed
        sessionStorage.clear();

        // Save the current user email or UID
        sessionStorage.setItem('userEmail', auth.currentUser.email);

        toast("You are now successfully logged in...");
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      })
      .catch(() => {
        toast('Wrong Credentials.');
      });
  };

  const handleSignup = () => {
    navigate('/register');
  }

  return (
    <div className='register-main'>
      <ToastContainer />
      <h1>Login</h1>

      <div className='card-main'>
        <div className='inputs-container'>
        <input
          placeholder='Enter your Email'
          className='input-fields'
          onChange={onInput}
          type='email'
          name='email'
          autoComplete="username" // Use correct semantics for email
        />
        <input
          placeholder='Enter your Password'
          className='input-fields'
          onChange={onInput}
          name='password'
          type='password'
          autoComplete="current-password" // Use correct semantics for password
        />
          <button className='input-btn'
            onClick={login}
          >
            Sign In
          </button>
        </div>
        <div className='su-btn'>
          Not Registered!!  
          <button className='input-btn' onClick={handleSignup}>Signup</button>
        </div>
      </div>
    </div>
  );
}