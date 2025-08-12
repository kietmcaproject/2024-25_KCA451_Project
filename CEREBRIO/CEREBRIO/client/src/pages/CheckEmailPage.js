import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import { FcGoogle } from 'react-icons/fc';

const CheckEmailPage = () => {
  const [data, setData] = useState({ email: "" });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({ email: "" });
        navigate('/password', { state: response?.data?.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.icon}>
          <PiUserCircle size={80} />
        </div>
        <h3 style={styles.title}>Welcome to Cerebrio!</h3>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor='email' style={styles.label}>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              value={data.email}
              onChange={handleOnChange}
              required
              style={styles.input}
            />
          </div>
          <button style={styles.submitButton}>Let's Go</button>
        </form>
        {/* Divider */}
        <div className='google-oauth-wrapper mt-5 text-center'>
          <p className='text-gray-500 mb-2'>or</p>
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
            className='flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 transition-all'
          >
            <FcGoogle size={20} />
            Sign in with Google
          </a>
        </div>
        <p style={styles.footerText}>New User? <Link to={"/register"} style={styles.registerLink}>Register</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    animation: 'backgroundFade 10s infinite alternate',
  },
  formCard: {
    background: '#ffffff',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    transform: 'scale(1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'scale(1.02)',
    },
  },
  icon: {
    color: '#6e45e2',
    animation: 'pulse 2s infinite',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    color: '#333',
    transition: 'color 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    marginTop: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#6e45e2',
  },
  input: {
    background: '#f9f9f9',
    border: '2px solid #ddd',
    padding: '0.8rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: '#6e45e2',
      boxShadow: '0 0 8px rgba(110, 69, 226, 0.3)',
    },
  },
  submitButton: {
    padding: '0.8rem 1.5rem',
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.3s',
    ':hover': {
      background: 'linear-gradient(135deg, #88d3ce, #6e45e2)',
      transform: 'scale(1.05)',
    },
  },
  footerText: {
    marginTop: '1.5rem',
    color: '#555',
  },
  registerLink: {
    color: '#6e45e2',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
    ':hover': {
      color: '#88d3ce',
    },
  },

  // Keyframes for animations
  '@keyframes backgroundFade': {
    '0%': { background: 'linear-gradient(135deg, #6e45e2, #88d3ce)' },
    '100%': { background: 'linear-gradient(135deg, #ff6f91, #ff9671)' },
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
  },
};

export default CheckEmailPage;
