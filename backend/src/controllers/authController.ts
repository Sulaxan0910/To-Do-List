import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '7d';

export const authController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'Username, email, and password are required' 
        });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({
        username,
        email,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user info (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user info (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  },

  // Get current user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      // This assumes authentication middleware has added user info to req
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const userData = await UserModel.findById(user.userId);
      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...userWithoutPassword } = userData;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  },

  // Demo login (for testing without registration)
  demoLogin: async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findByUsername('demo');
      if (!user) {
        return res.status(404).json({ error: 'Demo user not found' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ error: 'Failed to login as demo user' });
    }
  }
};