import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextField, Container, Typography, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // To fetch user roles
import { firestore } from '../../firebase'; // Firebase Firestore
import logo from '../../assets/logo.png'; // Assuming your logo image is saved in assets folder
import backgroundImg from '../../assets/login-background.jpg'; // Replace with your chosen image

export default function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Log the user in
      const userCredential = await login(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;

      // Fetch the user role from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data();

      // Role-based redirection
      if (userData.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (userData.role === 'vendor') {
        navigate('/dashboard/vendor');
      } else if (userData.role === 'hospitalStaff') {
        navigate('/dashboard/hospital');
      } else {
        setError('Unknown role, please contact admin.');
      }
    } catch (err) {
      setError('Failed to sign in');
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
          display: { xs: 'none', md: 'block' }, // Hides on small screens
        }}
      />

      {/* Login Form Section */}
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
    color: 'black',
  }}
>
  MediMatrix
</Typography>

          {error && <Typography color="error" align="center">{error}</Typography>}
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            inputRef={passwordRef}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            Log In
          </Button>
        </form>

        <Typography align="center" variant="body2" marginTop={2}>
          <Link href="/forgot-password">Forgot Password?</Link>
        </Typography>

        <Typography align="center" style={{ marginTop: '16px' }}>
          Don't have an account?{' '}
          <Link href="/register" variant="body2">Sign Up</Link>
        </Typography>
      </Container>
    </Box>
  );
}
