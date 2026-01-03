import React from 'react';
import { TaskStats as TaskStatsType } from '../types/task';

interface TaskStatsProps {
  stats: TaskStatsType;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  return (
    <div className="task-stats">
      <div className="columns is-multiline">
        {/* Total Tasks */}
        <div className="column is-3">
          <div className="box has-text-centered has-background-white-ter">
            <div className="icon is-large has-text-primary mb-3">
              <i className="fas fa-tasks fa-2x"></i>
            </div>
            <div className="title is-2 has-text-dark">{stats.total}</div>
            <div className="subtitle is-6 has-text-grey">Total Tasks</div>
          </div>
        </div>
        
        {/* Completed Tasks */}
        <div className="column is-3">
          <div className="box has-text-centered has-background-success-light">
            <div className="icon is-large has-text-success mb-3">
              <i className="fas fa-check-circle fa-2x"></i>
            </div>
            <div className="title is-2 has-text-dark">{stats.completed}</div>
            <div className="subtitle is-6 has-text-grey">Completed</div>
          </div>
        </div>
        
        {/* Incomplete Tasks */}
        <div className="column is-3">
          <div className="box has-text-centered has-background-warning-light">
            <div className="icon is-large has-text-warning mb-3">
              <i className="fas fa-clock fa-2x"></i>
            </div>
            <div className="title is-2 has-text-dark">{stats.incomplete}</div>
            <div className="subtitle is-6 has-text-grey">Pending</div>
          </div>
        </div>
        
        {/* Completion Rate */}
        <div className="column is-3">
          <div className="box has-text-centered has-background-info-light">
            <div className="icon is-large has-text-info mb-3">
              <i className="fas fa-chart-line fa-2x"></i>
            </div>
            <div className="title is-2 has-text-dark">{stats.completionRate}%</div>
            <div className="subtitle is-6 has-text-grey">Completion Rate</div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="box">
        <div className="level is-mobile mb-3">
          <div className="level-left">
            <div>
              <p className="title is-5">Your Progress</p>
              <p className="subtitle is-6 has-text-grey">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          </div>
          <div className="level-right">
            <span className="tag is-primary is-medium">
              {stats.completionRate}%
            </span>
          </div>
        </div>
        
        <progress 
          className="progress is-primary is-large" 
          value={stats.completionRate} 
          max="100"
        >
          {stats.completionRate}%
        </progress>
        
        <div className="level is-flex mt-4">
          <div className="level-left">
            <div className="tags">
              <span className="tag is-success is-light">
                <span className="icon is-small">
                  <i className="fas fa-check"></i>
                </span>
                <span>{stats.completed} completed</span>
              </span>
              <span className="tag is-warning is-light">
                <span className="icon is-small">
                  <i className="fas fa-clock"></i>
                </span>
                <span>{stats.incomplete} pending</span>
              </span>
            </div>
          </div>
          <div className="level-right">
            <p className="has-text-grey is-size-7">
              {stats.total === 0 ? 'No tasks yet' : 
               stats.completionRate === 100 ? 'All tasks completed! 🎉' :
               'Keep going!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;