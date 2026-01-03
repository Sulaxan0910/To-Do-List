import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types/task';
import { taskService } from '../services/api';

interface TaskListProps {
  filters: any;
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ filters, onTaskUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks(filters);
      setTasks(data.tasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await taskService.toggleTaskStatus(id);
      fetchTasks();
      onTaskUpdate();
      
      const notification = document.createElement('div');
      notification.className = 'notification is-success is-light';
      notification.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        Task status updated successfully!
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error('Error toggling task status:', err);
      alert('Failed to update task status');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await taskService.deleteTask(id);
      fetchTasks();
      onTaskUpdate();
      
      const notification = document.createElement('div');
      notification.className = 'notification is-info is-light';
      notification.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        Task deleted successfully!
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="has-text-centered py-6">
        <div className="loading-spinner mb-3"></div>
        <p className="has-text-grey">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification is-danger">
        <button className="delete" onClick={() => setError(null)}></button>
        {error}
        <div className="mt-3">
          <button className="button is-small is-light" onClick={fetchTasks}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="has-text-centered py-6">
        <div className="icon is-large mb-4">
          <i className="fas fa-tasks fa-3x has-text-grey-light"></i>
        </div>
        <h3 className="title is-5 mb-2">No tasks found</h3>
        <p className="subtitle is-6 mb-4 has-text-grey">
          {filters.search 
            ? 'No tasks match your search criteria. Try a different search term.' 
            : 'You don\'t have any tasks yet. Create your first task to get started!'}
        </p>
        {!filters.search && (
          <Link to="/add" className="button is-primary">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Create Your First Task</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="task-list">
      {/* Task Count Summary */}
      <div className="level is-flex mb-5">
        <div className="level-left">
          <div className="tags">
            <span className="tag is-light">
              <span className="icon is-small">
                <i className="fas fa-list"></i>
              </span>
              <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
            </span>
            <span className="tag is-success is-light">
              <span className="icon is-small">
                <i className="fas fa-check"></i>
              </span>
              <span>{tasks.filter(t => t.status === 'completed').length} completed</span>
            </span>
            <span className="tag is-warning is-light">
              <span className="icon is-small">
                <i className="fas fa-clock"></i>
              </span>
              <span>{tasks.filter(t => t.status === 'incomplete').length} pending</span>
            </span>
          </div>
        </div>
        <div className="level-right">
          <p className="is-size-7 has-text-grey">
            Sorted by: {filters.sortBy} ({filters.sortOrder})
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="columns is-multiline">
        {tasks.map((task) => (
          <div key={task.id} className="column is-12">
            <div className={`card ${task.status === 'completed' ? 'has-background-success-light' : 'has-background-warning-light'}`}>
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <button
                      className={`button is-rounded ${task.status === 'completed' ? 'is-success' : 'is-warning is-light'}`}
                      onClick={() => handleToggleStatus(task.id)}
                      title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <span className="icon">
                        <i className={`fas ${task.status === 'completed' ? 'fa-check' : 'fa-clock'}`}></i>
                      </span>
                    </button>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <div className="level is-mobile mb-2">
                        <div className="level-left">
                          <p className={`title is-5 ${task.status === 'completed' ? 'has-text-grey' : ''}`}>
                            {task.status === 'completed' && (
                              <span className="icon is-small has-text-success mr-2">
                                <i className="fas fa-check"></i>
                              </span>
                            )}
                            {task.title}
                            {task.status === 'completed' && <span className="has-text-grey-light"> (Completed)</span>}
                          </p>
                        </div>
                        <div className="level-right">
                          <div className="tags">
                            <span className={`tag ${task.status === 'completed' ? 'is-success' : 'is-warning'}`}>
                              {task.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="mb-3 has-text-grey-dark">{task.description}</p>
                      )}
                      
                      <div className="tags">
                        <span className="tag is-light">
                          <span className="icon is-small">
                            <i className="fas fa-calendar-plus"></i>
                          </span>
                          <span>Created: {formatDate(task.createdAt)}</span>
                        </span>
                        {task.createdAt !== task.updatedAt && (
                          <span className="tag is-light">
                            <span className="icon is-small">
                              <i className="fas fa-edit"></i>
                            </span>
                            <span>Updated: {formatDate(task.updatedAt)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modified footer with icons only */}
              <footer className="card-footer">
                <Link 
                  to={`/edit/${task.id}`} 
                  className="card-footer-item has-tooltip-arrow has-tooltip-right has-tooltip-info"
                  data-tooltip="Edit Task"
                  title="Edit Task"
                >
                  <span className="icon is-medium-mobile">
                    <i className="fas fa-edit"></i>
                  </span>
                  <span className="is-hidden-mobile ml-2">Edit</span>
                </Link>
                <a 
                  className="card-footer-item has-text-info has-tooltip-arrow has-tooltip-right has-tooltip-info"
                  onClick={() => handleToggleStatus(task.id)}
                  data-tooltip={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
                  title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="icon is-medium-mobile">
                    <i className={`fas ${task.status === 'completed' ? 'fa-undo' : 'fa-check-circle'}`}></i>
                  </span>
                  <span className="is-hidden-mobile ml-2">
                    {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  </span>
                </a>
                <a 
                  className="card-footer-item has-text-danger has-tooltip-arrow has-tooltip-left has-tooltip-danger"
                  onClick={() => handleDelete(task.id, task.title)}
                  data-tooltip="Delete Task"
                  title="Delete Task"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="icon is-medium-mobile">
                    <i className="fas fa-trash"></i>
                  </span>
                  <span className="is-hidden-mobile ml-2">Delete</span>
                </a>
              </footer>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination/Info Footer */}
      <div className="mt-5 has-text-centered">
        <p className="is-size-7 has-text-grey">
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          {filters.search && ` matching "${filters.search}"`}
        </p>
      </div>
    </div>
  );
};

export default TaskList;