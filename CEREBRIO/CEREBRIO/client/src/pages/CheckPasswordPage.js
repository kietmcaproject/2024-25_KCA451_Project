import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      });

      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem('token', response?.data?.token);

        setData({ password: "" });
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.avatarContainer}>
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 style={styles.userName}>{location?.state?.name}</h2>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor='password' style={styles.label}>Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              value={data.password}
              onChange={handleOnChange}
              required
              style={styles.input}
            />
          </div>

          <button style={styles.submitButton}>Login</button>
        </form>

        <p style={styles.footerText}>
          <Link to={"/forgot-password"} style={styles.forgotPasswordLink}>Forgot password?</Link>
        </p>
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
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: '1rem',
    animation: 'pulse 2s infinite',
  },
  userName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    color: '#333',
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
  forgotPasswordLink: {
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

export default CheckPasswordPage;
