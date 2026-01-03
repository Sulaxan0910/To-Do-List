import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '../types/task';
import { taskService } from '../services/api';

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<'completed' | 'incomplete'>('incomplete');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    if (!id) return;
    
    try {
      setFetching(true);
      const task = await taskService.getTaskById(id);
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    } catch (err: any) {
      setError('Failed to load task. The task might have been deleted or you don\'t have permission to edit it.');
      console.error('Error fetching task:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await taskService.updateTask(id, {
          title,
          description,
          status
        });
        
        const notification = document.createElement('div');
        notification.className = 'notification is-success is-light';
        notification.innerHTML = `
          <button class="delete" onclick="this.parentElement.remove()"></button>
          Task updated successfully! Redirecting to dashboard...
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        await taskService.createTask({
          title,
          description,
          status
        });
        
        const notification = document.createElement('div');
        notification.className = 'notification is-success is-light';
        notification.innerHTML = `
          <button class="delete" onclick="this.parentElement.remove()"></button>
          Task created successfully! Redirecting to dashboard...
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure? Any unsaved changes will be lost.')) {
      navigate('/dashboard');
    }
  };

  if (fetching) {
    return (
      <section className="section">
        <div className="container">
          <div className="has-text-centered py-6">
            <div className="loading-spinner mb-3"></div>
            <p className="has-text-grey">Loading task details...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-8-desktop is-10-tablet">
            <div className="box has-shadow">
              <div className="has-text-centered mb-5">
                <div className="icon is-large has-text-primary mb-3">
                  <i className={`fas fa-${id ? 'edit' : 'plus-circle'} fa-2x`}></i>
                </div>
                <h1 className="title is-3">{id ? 'Edit Task' : 'Create New Task'}</h1>
                <p className="subtitle is-6 has-text-grey">
                  {id ? 'Update your task details below' : 'Fill in the details to create a new task'}
                </p>
              </div>
              
              {error && (
                <div className="notification is-danger is-light mb-5">
                  <button className="delete" onClick={() => setError(null)}></button>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <div className="field">
                  <label className="label">
                    Task Title <span className="has-text-danger">*</span>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      required
                      disabled={loading}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-heading"></i>
                    </span>
                  </div>
                  <p className="help">Be specific and descriptive</p>
                </div>
                
                {/* Description Field */}
                <div className="field">
                  <label className="label">Description (Optional)</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add more details, notes, or instructions..."
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                  <p className="help">Provide additional context or details about this task</p>
                </div>
                
                {/* Status Selection - Improved with Bulma */}
                <div className="field">
                  <label className="label">Status</label>
                  <div className="control">
                    <div className="buttons has-addons">
                      <button
                        type="button"
                        className={`button ${status === 'incomplete' ? 'is-warning is-selected' : 'is-light'}`}
                        onClick={() => setStatus('incomplete')}
                        disabled={loading}
                      >
                        <span className="icon">
                          <i className="fas fa-clock"></i>
                        </span>
                        <span>Pending</span>
                      </button>
                      <button
                        type="button"
                        className={`button ${status === 'completed' ? 'is-success is-selected' : 'is-light'}`}
                        onClick={() => setStatus('completed')}
                        disabled={loading}
                      >
                        <span className="icon">
                          <i className="fas fa-check-circle"></i>
                        </span>
                        <span>Completed</span>
                      </button>
                    </div>
                  </div>
                  <p className="help mt-2">
                    <span className="icon is-small">
                      <i className="fas fa-info-circle"></i>
                    </span>
                    <span>Select the current status of your task</span>
                  </p>
                </div>
                
                {/* Form Actions */}
                <div className="field is-grouped is-grouped-centered mt-6">
                  <div className="control">
                    <button
                      type="button"
                      className="button is-light"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <span className="icon">
                        <i className="fas fa-times"></i>
                      </span>
                      <span>Cancel</span>
                    </button>
                  </div>
                  <div className="control">
                    <button
                      type="submit"
                      className={`button is-primary ${loading ? 'is-loading' : ''}`}
                      disabled={loading || !title.trim()}
                    >
                      <span className="icon">
                        <i className={`fas fa-${id ? 'save' : 'plus'}`}></i>
                      </span>
                      <span>{id ? 'Update Task' : 'Create Task'}</span>
                    </button>
                  </div>
                </div>
              </form>
              
              {/* Tips Section */}
              <div className="mt-6 pt-5 has-text-centered">
                <div className="content is-small has-text-grey">
                  <p className="mb-2">
                    <span className="icon is-small">
                      <i className="fas fa-lightbulb"></i>
                    </span>
                    <span><strong>Tip:</strong> Break large tasks into smaller, actionable items</span>
                  </p>
                  <p>
                    <span className="icon is-small">
                      <i className="fas fa-calendar"></i>
                    </span>
                    <span>Consider adding due dates in future updates</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskForm;