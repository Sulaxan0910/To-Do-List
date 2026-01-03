# **To-Do List Application - Complete Guide**

## **📋 Project Overview**

A full-stack To-Do List application with user authentication, built using React, Node.js, and TypeScript. The application allows users to create accounts, log in, and manage their personal task lists with features like filtering, sorting, searching, and task status management.

## **✨ Features**

### **🔐 Authentication & User Management**
- User registration with email, username, and password
- Secure login/logout functionality
- JWT-based authentication with token storage
- Demo account for quick testing
- Protected routes requiring authentication

### **✅ To Do List **
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- View task statistics (completion rate, counts)
- Task descriptions with rich text support
- Timestamps for creation and updates

### **🔍 Advanced Task Features**
- **Filter tasks** by status (All/Completed/Incomplete)
- **Sort tasks** by title, status, or creation date (ascending/descending)
- **Search tasks** by title or description
- **Edit existing tasks** with full form support
- **Bulk actions** for todo list

### **🎨 User Interface**
- Responsive design for all screen sizes
- Clean, modern interface with intuitive navigation
- Loading states and error handling
- Task statistics dashboard with progress visualization
- Real-time updates and feedback

## **🛠 Technology Stack**

### **Backend (Node.js + TypeScript)**
- **Express.js** - Web framework
- **TypeScript** - Type safety and development experience
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation
- **In-memory storage** (can be replaced with any database)

### **Frontend (React + TypeScript)**
- **React 18** - Frontend library
- **TypeScript** - Type safety
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management (authentication)
- **CSS3** - Custom styling with modern features

## **📁 Project Structure**

```
todo-app/
├── backend/                    # Node.js Backend API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # Data models (in-memory)
│   │   ├── middleware/        # Authentication middleware
│   │   ├── routes/           # API route definitions
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                # This file
```

## **🚀 Installation & Setup**

### **Prerequisites**
- **Node.js** (v16 or higher)
- **npm** (Node Package Manager)
- **Git** (optional)

### **Step 1: Clone/Create Project Structure**
```bash
# Create project directory
mkdir todo-app
cd todo-app

# Create backend and frontend directories
mkdir backend frontend
```

### **Step 2: Backend Setup**

#### **Navigate to backend directory:**
```bash
cd backend
```

#### **Create package.json:**
```json
{
  "name": "todo-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/uuid": "^9.0.7",
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0"
  }
}
```

#### **Create tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### **Create folder structure and files:**
```bash
mkdir -p src/{controllers,models,middleware,routes}
```

Create all backend files as provided in the previous messages:
- `src/models/User.ts`
- `src/models/Task.ts`
- `src/middleware/auth.ts`
- `src/controllers/authController.ts`
- `src/controllers/taskController.ts`
- `src/routes/authRoutes.ts`
- `src/routes/taskRoutes.ts`
- `src/index.ts`

#### **Create .env file:**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### **Install dependencies and start backend:**
```bash
npm install

# Generate hashed password for demo user
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('demo123', 10));"

# Copy the output hash and update it in src/models/User.ts for demo user

# Start backend server
npm run dev
```

### **Step 3: Frontend Setup**

#### **Navigate to frontend directory:**
```bash
cd ../frontend
```

#### **Create package.json:**
```json
{
  "name": "todo-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.6.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@types/react-router-dom": "^5.3.3",
    "react-scripts": "5.0.1",
    "typescript": "~4.9.5"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### **Create tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

#### **Create folder structure:**
```bash
mkdir -p src/{components,pages,context,services,types,utils} public
```

#### **Create public/index.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="To-Do List Application with React and TypeScript"
    />
    <title>To-Do List App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

Create all frontend files as provided in previous messages.

#### **Install dependencies and start frontend:**
```bash
npm install --legacy-peer-deps
npm start
```

## **🌐 Running the Application**

### **Development Mode**

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   - Server runs on: http://localhost:5000
   - API available at: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm start
   ```
   - App runs on: http://localhost:3000
   - Automatically opens in browser

### **Production Build**

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Backend:**
   ```bash
   cd backend
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   cd backend
   npm start
   ```

## **🔗 API Endpoints**

### **Authentication Endpoints**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/demo` - Demo login
- `GET /api/auth/profile` - Get user profile

### **Task Endpoints (Requires Authentication)**
- `GET /api/tasks` - Get all tasks with filters
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

## **👥 User Accounts**

### **Demo Account (Quick Start)**
- **Email**: demo@example.com
- **Password**: demo123
- **Use**: "Try Demo Account" button on login page

### **Create Your Own Account**
- Register with email, username, and password
- Minimum password length: 6 characters

## **🎯 Features in Detail**

### **1. Task Creation & Management**
- Add tasks with title, description, and status
- Edit any task with full form
- Delete tasks with confirmation
- Toggle task status between complete/incomplete

### **2. Filtering & Sorting**
- **Filter by**: All tasks, Completed only, Incomplete only
- **Sort by**: Title (A-Z/Z-A), Status, Creation date
- **Search**: Real-time search by title or description

### **3. Dashboard & Statistics**
- Total task count
- Completed/incomplete counts
- Completion percentage with progress bar
- Visual indicators for task status

### **4. User Experience**
- Responsive design for mobile/tablet/desktop
- Loading spinners during API calls
- Error messages for failed operations
- Persistent login sessions with JWT
- Form validation and user feedback

## **🔧 Technical Implementation Details**

### **Backend Architecture**
- **RESTful API** design following best practices
- **Middleware-based** authentication with JWT
- **TypeScript interfaces** for type safety
- **Error handling** middleware for consistent error responses
- **CORS configuration** for frontend communication

### **Frontend Architecture**
- **Component-based** React architecture
- **Context API** for global state (authentication)
- **Custom hooks** for reusable logic
- **Service layer** for API communication
- **TypeScript** throughout for type safety

### **State Management**
- **React Context** for authentication state
- **Local state** for component-specific data
- **LocalStorage** for persistent authentication
- **React Router** for client-side routing

## **⚠️ Important Notes**

### **Data Persistence**
- The current implementation uses **in-memory storage**
- Data is **lost when server restarts**
- For production, add a database (SQLite, PostgreSQL, MongoDB)

### **Security Considerations**
- Passwords are hashed with bcrypt
- JWT tokens expire for security
- Input validation on API endpoints
- CORS configured for specific origin

### **Development Notes**
- Frontend requires TypeScript 4.9.5 (not 5.x) due to react-scripts compatibility
- Use `--legacy-peer-deps` flag for npm install if needed
- Backend runs on port 5000, frontend on port 3000

## **🚀 Quick Start Script**

Create `start.sh` in project root:

```bash
#!/bin/bash

echo "🚀 Starting To-Do List Application..."

# Start backend
echo "📦 Starting backend server..."
cd backend
npm run dev &

# Wait for backend
sleep 3

# Start frontend
echo "⚛️  Starting frontend server..."
cd ../frontend
npm start &

echo ""
echo "✅ Application is running!"
echo "🌐 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Health check: http://localhost:5000/api/health"
echo ""
echo "📝 Use demo account:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
echo ""
echo "Press Ctrl+C to stop servers"
wait
```

Make executable and run:
```bash
chmod +x start.sh
./start.sh
```

## **🔍 Testing the Application**

### **Manual Testing**
1. Open http://localhost:3000
2. Click "Try Demo Account" or register new account
3. Add some tasks using "+ Add New Task"
4. Test filtering, sorting, and search
5. Edit and delete tasks
6. Check statistics on dashboard

### **API Testing with curl**
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Demo login
curl -X POST http://localhost:5000/api/auth/demo

# Get tasks (with token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/tasks
```

## **📊 Database Options**

### **Current: In-Memory Storage**
- Simple, no setup required
- Data lost on server restart
- Good for development/testing

### **For Production:**
1. **SQLite** (simplest): Single file, no server needed
2. **PostgreSQL** (recommended): Full-featured, robust
3. **MongoDB**: NoSQL option, flexible schema

## **🔮 Future Enhancements**

### **Planned Features**
- Task due dates and reminders
- Task categories/tags
- File attachments for tasks
- Email notifications
- Dark/light theme toggle
- Task export (PDF/CSV)
- Drag-and-drop task reordering

### **Technical Improvements**
- Add unit and integration tests
- Implement real database (PostgreSQL)
- Add Docker containerization
- Set up CI/CD pipeline
- Add API documentation (Swagger)
- Implement refresh tokens
- Add rate limiting

## **❓ Troubleshooting**

### **Common Issues:**

1. **Backend won't start on port 5000:**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   # Or change PORT in .env file
   ```

2. **Frontend won't start on port 3000:**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   # Or use different port
   PORT=3001 npm start
   ```

3. **TypeScript compilation errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

4. **Authentication errors:**
   - Clear browser localStorage
   - Restart both backend and frontend
   - Check JWT_SECRET matches in .env

### **Debug Commands:**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Check for TypeScript errors
npx tsc --noEmit
```

## **📝 License**

This project is for educational purposes. Feel free to use and modify as needed.

## **👨‍💻 Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## **🙏 Acknowledgments**

- Built with React, Node.js, and TypeScript
- Inspired by modern To-Do List application
- Designed for learning full-stack development

---

**Happy Task Managing!** 📝✅