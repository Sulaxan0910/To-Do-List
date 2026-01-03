import { Request, Response } from 'express';
import { TaskModel } from '../models/Task';

export const taskController = {
  // Get all tasks for current user with filtering, sorting, and search
  getUserTasks: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { status, sortBy, sortOrder, search } = req.query;

      let tasks = await TaskModel.findAllByUser(userId);

      // Apply search filter if provided
      if (search && typeof search === 'string') {
        tasks = await TaskModel.search(userId, search);
      }

      // Apply status filter if provided
      if (status && typeof status === 'string' && status !== 'all') {
        tasks = await TaskModel.filterByStatus(userId, status);
      }

      // Apply sorting if provided
      if (sortBy && typeof sortBy === 'string') {
        const order = sortOrder === 'desc' ? -1 : 1;
        
        tasks.sort((a, b) => {
          if (sortBy === 'title') {
            return order * a.title.localeCompare(b.title);
          } else if (sortBy === 'status') {
            return order * a.status.localeCompare(b.status);
          } else if (sortBy === 'createdAt') {
            return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          }
          return 0;
        });
      }

      // Get statistics
      const stats = await TaskModel.getStats(userId);

      res.json({
        tasks,
        stats,
        filters: {
          status: status || 'all',
          sortBy: sortBy || 'createdAt',
          sortOrder: sortOrder || 'desc',
          search: search || ''
        }
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Get task by ID for current user
  getTaskById: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const task = await TaskModel.findByIdAndUser(req.params.id, userId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  },

  // Create new task for current user
  createTask: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { title, description, status } = req.body;

      if (!title || !status) {
        return res.status(400).json({ 
          error: 'Title and status are required' 
        });
      }

      const task = await TaskModel.create({
        title,
        description,
        status,
        userId
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Update task for current user
  updateTask: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { title, description, status } = req.body;
      
      const updatedTask = await TaskModel.update(req.params.id, userId, {
        title,
        description,
        status
      });

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Delete task for current user
  deleteTask: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const deleted = await TaskModel.delete(req.params.id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  // Toggle task status for current user
  toggleTaskStatus: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const task = await TaskModel.findByIdAndUser(req.params.id, userId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updatedTask = await TaskModel.update(req.params.id, userId, {
        status: task.status === 'completed' ? 'incomplete' : 'completed'
      });

      res.json(updatedTask);
    } catch (error) {
      console.error('Toggle task error:', error);
      res.status(500).json({ error: 'Failed to toggle task status' });
    }
  },

  // Get task statistics for current user
  getTaskStats: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const stats = await TaskModel.getStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get task statistics' });
    }
  }
};