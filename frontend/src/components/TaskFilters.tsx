import React from 'react';
import { TaskFilters as TaskFiltersType } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: Partial<TaskFiltersType>) => void;
  onClearFilters: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const handleStatusChange = (status: string) => {
    onFilterChange({ status: status as TaskFiltersType['status'] });
  };

  const handleSortByChange = (sortBy: string) => {
    onFilterChange({ sortBy: sortBy as TaskFiltersType['sortBy'] });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFilterChange({ sortOrder: sortOrder as TaskFiltersType['sortOrder'] });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.search !== '' || 
    filters.sortBy !== 'createdAt' || 
    filters.sortOrder !== 'desc';

  return (
    <div className="task-filters">
      {/* Search Bar */}
      <div className="field">
        <label className="label has-text-weight-normal">Search Tasks</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by title or description..."
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search"></i>
          </span>
          {filters.search && (
            <span 
              className="icon is-small is-right" 
              style={{ cursor: 'pointer' }}
              onClick={() => onFilterChange({ search: '' })}
            >
              <i className="fas fa-times"></i>
            </span>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="field">
        <label className="label has-text-weight-normal">Filter by Status</label>
        <div className="control">
          <div className="buttons are-small">
            <button
              className={`button ${filters.status === 'all' ? 'is-primary' : 'is-light'}`}
              onClick={() => handleStatusChange('all')}
            >
              <span className="icon is-small">
                <i className="fas fa-layer-group"></i>
              </span>
              <span>All</span>
            </button>
            <button
              className={`button ${filters.status === 'completed' ? 'is-success' : 'is-light'}`}
              onClick={() => handleStatusChange('completed')}
            >
              <span className="icon is-small">
                <i className="fas fa-check"></i>
              </span>
              <span>Completed</span>
            </button>
            <button
              className={`button ${filters.status === 'incomplete' ? 'is-warning' : 'is-light'}`}
              onClick={() => handleStatusChange('incomplete')}
            >
              <span className="icon is-small">
                <i className="fas fa-clock"></i>
              </span>
              <span>Pending</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="field">
        <label className="label has-text-weight-normal">Sort Tasks</label>
        <div className="field is-grouped">
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortByChange(e.target.value)}
              >
                <option value="createdAt">Date Created</option>
                <option value="title">Task Title</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                value={filters.sortOrder}
                onChange={(e) => handleSortOrderChange(e.target.value)}
              >
                <option value="desc">Newest/Descending</option>
                <option value="asc">Oldest/Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="field">
          <div className="control">
            <button
              className="button is-light is-fullwidth"
              onClick={onClearFilters}
            >
              <span className="icon is-small">
                <i className="fas fa-filter-circle-xmark"></i>
              </span>
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4">
          <p className="has-text-weight-semibold is-size-7 mb-2">Active Filters:</p>
          <div className="tags">
            {filters.status !== 'all' && (
              <span className="tag is-info is-light">
                <span className="icon is-small">
                  <i className="fas fa-filter"></i>
                </span>
                <span>Status: {filters.status}</span>
              </span>
            )}
            {filters.search && (
              <span className="tag is-info is-light">
                <span className="icon is-small">
                  <i className="fas fa-search"></i>
                </span>
                <span>Search: "{filters.search}"</span>
              </span>
            )}
            <span className="tag is-info is-light">
              <span className="icon is-small">
                <i className="fas fa-sort"></i>
              </span>
              <span>Sort: {filters.sortBy} ({filters.sortOrder})</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;