import React, { useState } from 'react';
import axios from 'axios';
import '../../AuthStyles.css';
import { Link } from 'react-router-dom';

interface SignupFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupScreen: React.FC = () => {
  const [formState, setFormState] = useState<SignupFormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
    setApiError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
     
      const response = await axios.post('https://md-editor-server-uvps.onrender.com/api/auth/register', {
        username: formState.username,
        email: formState.email,
        password: formState.password,
      });

      console.log('Signup successful o:', response.data.message);

     
      setSuccessMessage('Account created successfully!');
      
      setTimeout(() => { window.location.href = '/login'; }, 2000);

      setFormState({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      
      setApiError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="username"
              className="auth-input"
              placeholder="Username"
              value={formState.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Email address"
              value={formState.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`auth-input ${passwordError ? 'error' : ''}`}
              placeholder="Password"
              value={formState.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className={`auth-input ${passwordError ? 'error' : ''}`}
              placeholder="Confirm password"
              value={formState.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {passwordError && <p className="error-text">{passwordError}</p>}
          {apiError && <p className="error-text">{apiError}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-links">
        <Link to="/login" className="auth-link">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
