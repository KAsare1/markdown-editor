import React, { useState } from 'react';
import axios from 'axios'; // Axios for HTTP requests
import '../../AuthStyles.css';

interface LoginFormState {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('https://md-editor-server-uvps.onrender.com/api/auth/login', formState, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful login
      console.log('Login successful:', response.data);

      // Save token or other data if necessary
      localStorage.clear();
      localStorage.setItem('authToken', response.data.token);

      // Redirect to the dashboard or another screen
      window.location.href = '/';
    } catch (error: any) {
      setLoading(false);

      // Handle error response
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please sign in to your account</p>
        </div>

        {errorMessage && <p className="auth-error">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
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
              className="auth-input"
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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/signup" className="auth-link">Don't have an account? Sign up</a>
          <br />
          <a href="/forgot-password" className="auth-link">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
