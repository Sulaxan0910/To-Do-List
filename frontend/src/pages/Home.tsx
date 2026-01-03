import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <section className="hero is-fullheight is-gradient">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="loading-spinner mb-4"></div>
            <p className="title is-5 has-text-grey">Loading TaskFlow...</p>
          </div>
        </div>
      </section>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Home;