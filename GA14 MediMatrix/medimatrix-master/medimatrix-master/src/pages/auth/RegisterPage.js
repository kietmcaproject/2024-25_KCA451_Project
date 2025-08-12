import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextField, Container, Typography, MenuItem, Select, FormControl, InputLabel, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase'; // Firebase Firestore for saving user role
import { doc, setDoc } from 'firebase/firestore'; // For adding user role data to Firestore
import logo from '../../assets/logo.png'; // Assuming your logo image is saved in assets folder
import backgroundImg from '../../assets/register-background.jpg'; // Replace with your chosen image

export default function RegisterPage() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Sign up the user
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;

      // Store the user information and role in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: user.email,
        role: roleRef.current.value,
      });

      // Navigate to corresponding dashboard based on selected role
      if (roleRef.current.value === 'admin') {
        navigate('/dashboard/admin');
      } else if (roleRef.current.value === 'vendor') {
        navigate('/dashboard/vendor');
      } else if (roleRef.current.value === 'hospitalStaff') {
        navigate('/dashboard/hospital');
      } else {
        setError('Unknown role, please contact support.');
      }
    } catch (e) {
      setError('Failed to create account: ' + e.message);
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

      {/* Register Form Section */}
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
            label="First Name"
            inputRef={firstNameRef}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Last Name"
            inputRef={lastNameRef}
          />
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              inputRef={roleRef}
              defaultValue=""
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
              <MenuItem value="hospitalStaff">Hospital Staff</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography align="center" style={{ marginTop: '16px' }}>
          Already have an account?{' '}
          <Link href="/" variant="body2">Log In</Link>
        </Typography>
      </Container>
    </Box>
  );
}
