import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfilePage() {
  const { currentUser, updateUserProfile } = useAuth();
  const [name, setName] = React.useState(currentUser.name);
  const [email, setEmail] = React.useState(currentUser.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ name, email });
    alert('Profile updated successfully!');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">User Profile</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Container>
  );
}
