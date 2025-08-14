import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(oldPassword, newPassword);
      alert('Password changed successfully');
    } catch (error) {
      alert('Error changing password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Change Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Change Password
        </Button>
      </form>
    </Container>
  );
}
