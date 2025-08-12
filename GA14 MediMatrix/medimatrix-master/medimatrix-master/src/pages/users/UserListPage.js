import React from 'react';
import { Container, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useUsers } from '../../contexts/UserContext';

export default function UserListPage() {
  const { users } = useUsers();

  if (!users) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Grid container spacing={3}>
        {users.length > 0 ? (
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Paper elevation={3} style={{ padding: '16px' }}>
                <Typography variant="h6">Name: {user.name}</Typography>
                <Typography>Role: {user.role}</Typography>
                <Typography>Email: {user.email}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
              <Typography>No users found.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
