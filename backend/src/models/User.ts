import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Remove the password deletion from toJSON transform
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    const transformedRet = ret as any;
    transformedRet.id = transformedRet._id.toString();
    delete transformedRet._id;
    delete transformedRet.__v; // Only delete __v, KEEP password
    return transformedRet;
  }
});

// Create the Mongoose model
const User = mongoose.model<IUser>('User', UserSchema);

// Helper function to transform user document
const transformUser = (user: any): any => {
  return {
    id: user._id ? user._id.toString() : user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

// Export model methods that match your existing interface
export const UserModel = {
  // Find user by email
  findByEmail: async (email: string): Promise<any> => {
    const user = await User.findOne({ email }).exec();
    if (!user) return null;
    
    // Return user WITH password for login comparison
    return transformUser(user.toObject());
  },

  // Find user by ID
  findById: async (id: string): Promise<any> => {
    try {
      const user = await User.findById(id).exec();
      if (!user) return null;
      
      // Transform and remove password
      const userObj = transformUser(user.toObject());
      const { password, ...userWithoutPassword } = userObj;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  },

  // Find user by username
  findByUsername: async (username: string): Promise<any> => {
    const user = await User.findOne({ username }).exec();
    if (!user) return null;
    
    // Transform and remove password
    const userObj = transformUser(user.toObject());
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  },

  // Create new user with hashed password
  create: async (userData: { username: string; email: string; password: string }): Promise<any> => {
    // Hash the password before creating user
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword
    });
    await user.save();
    
    // Return without password
    const userObj = transformUser(user.toObject());
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  },

  // Get all users (for admin purposes)
  findAll: async (): Promise<any[]> => {
    const users = await User.find().exec();
    return users.map(user => {
      const userObj = transformUser(user.toObject());
      const { password, ...userWithoutPassword } = userObj;
      return userWithoutPassword;
    });
  }
};