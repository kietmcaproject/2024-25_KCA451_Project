import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';
import logo from '../../assets/logo.png'; // Logo for branding
import backgroundImg from '../../assets/forgot-password-background.jpg'; // Background image

export default function ForgotPasswordPage() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Image Section */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'block' },
        }}
      />

      {/* Forgot Password Form Section */}
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <img src={logo} alt="App Logo" style={{ width: '100px', marginBottom: '16px' }} />
          <Typography
  variant="h5"
  noWrap
  sx={{
    fontFamily: 'Poppins, sans-serif', // Updated to use the Google Fonts CDN
    fontWeight: 600,
    fontSize: '1.8rem',
    letterSpacing: 1,
    color: 'red',
  }}
>
  MediMatrix
</Typography>

          {error && <Typography color="error" align="center">{error}</Typography>}
          {message && <Typography color="primary" align="center">{message}</Typography>}
        </Box>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            inputRef={emailRef}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            Reset Password
          </Button>
        </form>

        <Typography align="center" style={{ marginTop: '16px' }}>
          <Link href="/" variant="body2">Back to Login</Link>
        </Typography>
      </Container>
    </Box>
  );
}
