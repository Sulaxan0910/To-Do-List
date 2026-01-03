import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import TaskStats from '../components/TaskStats';
import { TaskFilters as TaskFiltersType, TaskStats as TaskStatsType } from '../types/task';
import { taskService } from '../services/api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: ''
  });
  const [stats, setStats] = useState<TaskStatsType>({
    total: 0,
    completed: 0,
    incomplete: 0,
    completionRate: 0
  });
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Fetch stats when component mounts or when tasks are updated
  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const statsData = await taskService.getTaskStats();
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<TaskFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: ''
    });
  };

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => !prev);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close user dropdown when toggling main menu
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Close dropdowns when clicking outside (optional)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        const dropdown = document.querySelector('.navbar-dropdown');
        const trigger = document.querySelector('.navbar-link');
        if (dropdown && !dropdown.contains(event.target as Node) && 
            trigger && !trigger.contains(event.target as Node)) {
          setIsUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  if (loading) {
    return (
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="loading-spinner mb-4"></div>
            <p className="title is-5 has-text-grey">Loading dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link to="/dashboard" className="navbar-item">
              <span className="ml-2 has-text-weight-bold is-size-5">TaskFlow</span>
            </Link>
            
            <a 
              role="button" 
              className={`navbar-burger has-text-black ${isMenuOpen ? 'is-active' : ''}`} 
              aria-label="menu" 
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
            <div className="navbar-start">
              <Link to="/dashboard" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
                <span className="icon">
                  <i className="fas fa-home"></i>
                </span>
                <span>Dashboard</span>
              </Link>
              <Link to="/add" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add Task</span>
              </Link>
            </div>

            <div className="navbar-end">
              <div className={`navbar-item has-dropdown ${isUserDropdownOpen ? 'is-active' : ''}`}>
                <a 
                  className="navbar-link is-arrowless" 
                  onClick={toggleUserDropdown}
                  aria-haspopup="true" 
                  aria-expanded={isUserDropdownOpen}
                >
                  <span className="icon">
                    <i className="fas fa-user-circle"></i>
                  </span>
                  <span className="ml-2 is-hidden-touch">{user?.username || 'User'}</span>
                  <span className="ml-2 is-hidden-desktop">Account</span>
                </a>
                <div className={`navbar-dropdown is-right ${isUserDropdownOpen ? 'is-active' : ''}`}>
                  <div className="navbar-item">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-32x32">
                          <div className="has-background-primary has-text-white is-rounded has-text-centered py-1">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </figure>
                      </div>
                      <div className="media-content">
                        <p className="has-text-weight-semibold is-size-6">{user?.username}</p>
                        <p className="is-size-7 has-text-grey">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <hr className="navbar-divider" />
                  <Link 
                    to="/dashboard" 
                    className="navbar-item" 
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-user"></i>
                    </span>
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="navbar-item" 
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-cog"></i>
                    </span>
                    <span>Settings</span>
                  </Link>
                  <hr className="navbar-divider" />
                  <a 
                    className="navbar-item has-text-danger" 
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-sign-out-alt"></i>
                    </span>
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="section" style={{ paddingTop: '80px' }}>
        <div className="container">
          {/* Welcome Header */}
          <div className="box has-background-primary-light">
            <div className="level">
              <div className="level-left">
                <div>
                  <h1 className="title is-3 has-text-primary">Welcome back, {user?.username}! 👋</h1>
                  <p className="subtitle is-6 has-text-grey">
                    Here's what's happening with your tasks today
                  </p>
                </div>
              </div>
              <div className="level-right">
                <div className="buttons">
                  <Link to="/add" className="button is-primary is-rounded">
                    <span className="icon">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>New Task</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-6">
            <TaskStats stats={stats} />
          </div>

          {/* Main Content Area */}
          <div className="columns">
            {/* Filters Sidebar */}
            <div className="column is-3">
              <div className="box is-sticky" style={{ position: 'sticky', top: '100px' }}>
                <h2 className="title is-5 mb-4">Filters & Search</h2>
                <TaskFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
                
                {/* Quick Actions */}
                <div className="mt-6">
                  <h3 className="title is-6 mb-3">Quick Actions</h3>
                  <div className="buttons are-small">
                    <button 
                      onClick={() => handleFilterChange({ status: 'incomplete' })}
                      className="button is-warning is-light is-fullwidth"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-clock"></i>
                      </span>
                      <span>Pending Tasks</span>
                    </button>
                    <button 
                      onClick={() => handleFilterChange({ status: 'completed' })}
                      className="button is-success is-light is-fullwidth"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-check"></i>
                      </span>
                      <span>Completed</span>
                    </button>
                    <Link to="/add" className="button is-primary is-light is-fullwidth">
                      <span className="icon is-small">
                        <i className="fas fa-plus"></i>
                      </span>
                      <span>Add Task</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Main Area */}
            <div className="column is-9">
              <div className="box">
                <div className="level">
                  <div className="level-left">
                    <h2 className="title is-4">Your Tasks</h2>
                  </div>
                  <div className="level-right">
                    <div className="tags has-addons">
                      <span className="tag is-dark">Total</span>
                      <span className="tag is-primary">{stats.total}</span>
                    </div>
                  </div>
                </div>
                
                <TaskList 
                  filters={filters}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>TaskFlow</strong> - A modern To-Do List application
          </p>
          <p className="is-size-7 has-text-grey mt-2">
            Built with React, TypeScript, and Bulma • © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;