import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';

const AddTask: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="loading-spinner"></div>
            <p className="mt-3">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleBackClick = () => {
    // Go back to previous page, or to home if no history exists
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // Go back one page in history
    } else {
      navigate('/', { replace: true }); // Go to home if no history
    }
  };

  return (
    <div className="add-task-page">
      {/* Header */}
      <nav className="navbar is-primary">
        <div className="container">
          <div className="navbar-brand">
            <button 
              onClick={handleBackClick}
              className="navbar-item"
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                padding: '0.75rem'
              }}
              aria-label="Go back"
            >
              <span className="icon">
                <i className="fas fa-arrow-left"></i>
              </span>
            </button>
            <div className="navbar-item">
              <h1 className="title is-4 has-text-white">Add New Task</h1>
            </div>
          </div>
        </div>
      </nav>

      <TaskForm />
    </div>
  );
};

export default AddTask;
