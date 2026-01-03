import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { user, token } = await authService.login(email, password);
      login(user, token);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'notification is-success is-light';
      notification.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        Login successful! Redirecting to dashboard...
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { user, token } = await authService.demoLogin();
      login(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Demo account is currently unavailable. Please try registering.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero is-fullheight is-gradient">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              {/* Brand Header */}
              <div className="has-text-centered mb-6">
                <div className="icon is-large has-text-primary mb-3">
                  <i className="fas fa-tasks fa-2x"></i>
                </div>
                <h1 className="title is-3">TaskFlow</h1>
                <p className="subtitle is-6 has-text-grey">Your personal productivity companion</p>
              </div>

              {/* Login Card */}
              <div className="box has-shadow">
                <h2 className="title is-4 has-text-centered mb-4">Welcome Back</h2>
                
                {error && (
                  <div className="notification is-danger is-light mb-4">
                    <button className="delete" onClick={() => setError('')}></button>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div className="field">
                    <div className="control">
                      <button
                        className={`button is-primary is-fullwidth is-medium ${loading ? 'is-loading' : ''}`}
                        type="submit"
                        disabled={loading}
                      >
                        <span className="icon">
                          <i className="fas fa-sign-in-alt"></i>
                        </span>
                        <span>Sign In</span>
                      </button>
                    </div>
                  </div>
                </form>
                
                <div className="has-text-centered my-5">
                  <div className="divider">or</div>
                </div>
                
                <div className="field">
                  <div className="control">
                    <button
                      className={`button is-info is-outlined is-fullwidth ${loading ? 'is-loading' : ''}`}
                      onClick={handleDemoLogin}
                      disabled={loading}
                    >
                      <span className="icon">
                        <i className="fas fa-user-secret"></i>
                      </span>
                      <span>Try Demo Account</span>
                    </button>
                  </div>
                </div>
                
                <div className="has-text-centered mt-5">
                  <p className="has-text-grey">
                    New to TaskFlow?{' '}
                    <Link to="/register" className="has-text-primary has-text-weight-semibold">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
              
              {/* Footer Note */}
              <div className="has-text-centered mt-5">
                <p className="is-size-7 has-text-grey-light">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;