import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';

const AddTask: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

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

  return (
    <div className="add-task-page">
      {/* Header */}
      <nav className="navbar is-primary">
        <div className="container">
          <div className="navbar-brand">
            <a href="/dashboard" className="navbar-item">
              <span className="icon">
                <i className="fas fa-arrow-left"></i>
              </span>
            </a>
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