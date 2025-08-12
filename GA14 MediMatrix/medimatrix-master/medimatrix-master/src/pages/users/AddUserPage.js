import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useUsers } from '../../contexts/UserContext';

export default function AddUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const { addUser } = useUsers();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUser({ name, email, role });
      alert('User added successfully');
    } catch (error) {
      alert('Error adding user');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Add New User</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          label="Name"
          fullWidth
          required
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Role"
          fullWidth
          required
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
          Add User
        </Button>
      </form>
    </Container>
  );
}
