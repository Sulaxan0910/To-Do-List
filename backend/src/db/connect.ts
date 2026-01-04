import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Check if demo user exists, create if not
    await ensureDemoUser();
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const ensureDemoUser = async () => {
  try {
    const User = mongoose.model('User');
    
    const demoUser = await User.findOne({ email: 'demo@example.com' }).exec();
    
    if (!demoUser) {
      console.log('Creating demo user...');
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      const newDemoUser = new User({
        username: 'demo',
        email: 'demo@example.com',
        password: hashedPassword
      });
      
      await newDemoUser.save();
      console.log('Demo user created successfully');
    }
  } catch (error) {
    console.error('Error ensuring demo user:', error);
  }
};

export default connectDB;