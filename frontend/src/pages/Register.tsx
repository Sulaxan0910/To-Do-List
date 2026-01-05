import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { user, token } = await authService.register(username, email, password);
      register(user, token);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'notification is-success is-light';
      notification.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        Account created successfully! Welcome aboard!
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
                <h1 className="title is-3">Join To-Do List</h1>
                <p className="subtitle is-6 has-text-grey">Start managing your To-Do List effectively</p>
              </div>

              {/* Register Card */}
              <div className="box has-shadow">
                <h2 className="title is-4 has-text-centered mb-4">Create Account</h2>
                
                {error && (
                  <div className="notification is-danger is-light mb-4">
                    <button className="delete" onClick={() => setError('')}></button>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Username</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                  </div>
                  
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
                    <p className="help">Must be at least 6 characters</p>
                  </div>
                  
                  <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="help has-text-danger">Passwords do not match</p>
                    )}
                  </div>
                  
                  <div className="field">
                    <div className="control">
                      <button
                        className={`button is-primary is-fullwidth is-medium ${loading ? 'is-loading' : ''}`}
                        type="submit"
                        disabled={loading}
                      >
                        <span className="icon">
                          <i className="fas fa-user-plus"></i>
                        </span>
                        <span>Create Account</span>
                      </button>
                    </div>
                  </div>
                </form>
                
                <div className="has-text-centered mt-5">
                  <p className="has-text-grey">
                    Already have an account?{' '}
                    <Link to="/login" className="has-text-primary has-text-weight-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
              
              {/* Footer Note */}
              <div className="has-text-centered mt-5">
                <p className="is-size-7 has-text-grey-light">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;