export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for users
let users: IUser[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: '$2a$10$YourHashedPasswordHere', // demo123
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const UserModel = {
  // Find user by email
  findByEmail: async (email: string): Promise<IUser | null> => {
    return users.find(user => user.email === email) || null;
  },

  // Find user by ID
  findById: async (id: string): Promise<IUser | null> => {
    return users.find(user => user.id === id) || null;
  },

  // Find user by username
  findByUsername: async (username: string): Promise<IUser | null> => {
    return users.find(user => user.username === username) || null;
  },

  // Create new user
  create: async (userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> => {
    const newUser: IUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },

  // Get all users (for admin purposes)
  findAll: async (): Promise<IUser[]> => {
    return users;
  }
};