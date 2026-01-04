import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'completed' | 'incomplete';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['completed', 'incomplete'],
    default: 'incomplete'
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

// Type-safe toJSON transform
TaskSchema.set('toJSON', {
  transform: function(doc, ret) {
    const transformedRet = ret as any;
    transformedRet.id = transformedRet._id.toString();
    delete transformedRet._id;
    delete transformedRet.__v;
    return transformedRet;
  }
});

// Create the Mongoose model
const Task = mongoose.model<ITask>('Task', TaskSchema);

// Export model methods that match your existing interface
export const TaskModel = {
  // Get all tasks for a specific user
  findAllByUser: async (userId: string): Promise<any[]> => {
    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    return tasks.map(task => task.toJSON());
  },

  // Get task by ID for a specific user
  findByIdAndUser: async (id: string, userId: string): Promise<any> => {
    try {
      const task = await Task.findOne({ _id: id, userId }).exec();
      return task ? task.toJSON() : null;
    } catch (error) {
      return null;
    }
  },

  // Create new task for a user
  create: async (taskData: { 
    title: string; 
    description?: string; 
    status: 'completed' | 'incomplete';
    userId: string;
  }): Promise<any> => {
    const task = new Task(taskData);
    await task.save();
    return task.toJSON();
  },

  // Update task for a user
  update: async (id: string, userId: string, taskData: Partial<any>): Promise<any> => {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { ...taskData },
      { new: true, runValidators: true }
    ).exec();
    return task ? task.toJSON() : null;
  },

  // Delete task for a user
  delete: async (id: string, userId: string): Promise<boolean> => {
    const result = await Task.deleteOne({ _id: id, userId }).exec();
    return result.deletedCount > 0;
  },

  // Search tasks for a user
  search: async (userId: string, query: string): Promise<any[]> => {
    const tasks = await Task.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .exec();
    return tasks.map(task => task.toJSON());
  },

  // Filter tasks by status for a user
  filterByStatus: async (userId: string, status: string): Promise<any[]> => {
    const query: any = { userId };
    if (status !== 'all') {
      query.status = status;
    }
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .exec();
    return tasks.map(task => task.toJSON());
  },

  // Get task statistics for a user
  getStats: async (userId: string) => {
    const total = await Task.countDocuments({ userId }).exec();
    const completed = await Task.countDocuments({ userId, status: 'completed' }).exec();
    const incomplete = total - completed;
    
    return {
      total,
      completed,
      incomplete,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
};