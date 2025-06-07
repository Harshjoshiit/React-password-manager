import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

export default function BasicModal({ open, handleClose, addPasswords }) {
  const [passwordInputs, setPasswordInputs] = useState({ name: '', password: '' });

  // Reset inputs when modal opens to prevent previous values showing up
  useEffect(() => {
    if (open) {
      setPasswordInputs({ name: '', password: '' });
    }
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordInputs({ ...passwordInputs, [name]: value });
  };

  const handleAddPasswords = () => {
    if (passwordInputs.name && passwordInputs.password) {
      addPasswords(passwordInputs);
      // Don't reset here, as it might cause issues before the modal closes
      handleClose();
    } else {
      console.log('Invalid input');
    }
  };

  const modalClose = () => {
    setPasswordInputs({ name: '', password: '' });
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={modalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a Password
          </Typography>
          <input
            placeholder='Enter your Page name'
            className='input-fields'
            onChange={handleInputChange}
            name='name'
            value={passwordInputs.name}
            type='text'
            autoComplete="off" // Prevent browser autocomplete
            key={`name-${open}`} // Force re-render when modal opens
          />
          <input
            placeholder='Enter your password'
            className='input-fields'
            onChange={handleInputChange}
            name='password'
            value={passwordInputs.password}
            type='password'
            autoComplete="new-password" // Special value to prevent password managers from filling
            key={`password-${open}`} // Force re-render when modal opens
          />
          <button className='input-btn' onClick={handleAddPasswords}>Add</button>
        </Box>
      </Modal>
    </div>
  );
}