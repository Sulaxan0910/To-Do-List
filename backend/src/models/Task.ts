export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'incomplete';
  userId: string; // Added user association
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage with user association
let tasks: ITask[] = [
  {
    id: '1',
    title: 'Learn React',
    description: 'Complete React tutorial',
    status: 'completed',
    userId: '1',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-02')
  },
  {
    id: '2',
    title: 'Build Todo App',
    description: 'Create full-stack todo application',
    status: 'incomplete',
    userId: '1',
    createdAt: new Date('2023-10-02'),
    updatedAt: new Date('2023-10-02')
  }
];

export const TaskModel = {
  // Get all tasks for a specific user
  findAllByUser: async (userId: string): Promise<ITask[]> => {
    return tasks.filter(task => task.userId === userId);
  },

  // Get task by ID for a specific user
  findByIdAndUser: async (id: string, userId: string): Promise<ITask | null> => {
    return tasks.find(task => task.id === id && task.userId === userId) || null;
  },

  // Create new task for a user
  create: async (taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask> => {
    const newTask: ITask = {
      id: Math.random().toString(36).substr(2, 9),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    return newTask;
  },

  // Update task for a user
  update: async (id: string, userId: string, taskData: Partial<ITask>): Promise<ITask | null> => {
    const index = tasks.findIndex(task => task.id === id && task.userId === userId);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date()
    };

    return tasks[index];
  },

  // Delete task for a user
  delete: async (id: string, userId: string): Promise<boolean> => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => !(task.id === id && task.userId === userId));
    return tasks.length < initialLength;
  },

  // Search tasks for a user
  search: async (userId: string, query: string): Promise<ITask[]> => {
    const userTasks = tasks.filter(task => task.userId === userId);
    return userTasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // Filter tasks by status for a user
  filterByStatus: async (userId: string, status: string): Promise<ITask[]> => {
    const userTasks = tasks.filter(task => task.userId === userId);
    if (status === 'all') return userTasks;
    return userTasks.filter(task => task.status === status);
  },

  // Get task statistics for a user
  getStats: async (userId: string) => {
    const userTasks = tasks.filter(task => task.userId === userId);
    const total = userTasks.length;
    const completed = userTasks.filter(task => task.status === 'completed').length;
    const incomplete = total - completed;
    
    return {
      total,
      completed,
      incomplete,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
};