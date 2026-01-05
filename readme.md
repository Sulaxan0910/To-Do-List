# **To-Do List Application - Local Setup Guide**

## **📋 Prerequisites**
Make sure you have **Node.js v16 or higher** installed: https://nodejs.org/

## **🚀 Quick Copy-Paste Setup**

### **1. Navigate to Project Root**
```bash
cd todo-app
```

### **2. Backend Setup**
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file for backend
```
**Create a file named `.env` in the `backend` directory with this content:**
```
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/todo-app

# Auth
JWT_SECRET=todo_list_super_secret_key
JWT_EXPIRES_IN=1d

# CORS
CLIENT_URL=http://localhost:3000
```

# Build backend
npm run build

# Start backend (in a new terminal)
npm run dev
```

### **3. Frontend Setup**
```bash
# Navigate to frontend (from project root)
cd ../frontend

# Install dependencies
npm install

# Create .env file for frontend
```
**Create a file named `.env` in the `frontend` directory with this content:**
```
# App
REACT_APP_NAME=ToDoList
REACT_APP_ENV=development

# API
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

# Start frontend (in a new terminal)
npm start
```

### **4. Start Both Servers (Windows Batch File)**
Create `start.bat` in the project root:
```batch
@echo off
echo Starting To-Do List Application...
echo.

echo Starting backend server...
start cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak >nul

echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo.
echo ✅ Application is running!
echo 🌐 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo.
echo 📝 Use demo account:
echo    Email: demo@example.com
echo    Password: demo123
echo.
pause
```

## **🔧 IMPORTANT: MongoDB Setup**

**You need MongoDB running locally:**

### **Option 1: Install MongoDB Community Edition**
1. Download and install MongoDB from: https://www.mongodb.com/try/download/community
2. Run MongoDB as a service or manually start it

### **Option 2: Use Docker**
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### **Option 3: MongoDB Atlas (Cloud)**
If using MongoDB Atlas cloud database:
1. Replace the `MONGO_URI` in `backend/.env` with your Atlas connection string
2. Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app?retryWrites=true&w=majority`

## **✅ Quick Test**
```bash
# Test backend is running
curl http://localhost:5000/api/health

# Then open in browser
# Frontend: http://localhost:3000
```

## **⚠️ Troubleshooting Quick Fixes**

If you get errors:

```batch
:: 1. Clear node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install

:: 2. Port already in use
netstat -ano | findstr :5000
taskkill /PID <PID> /F

:: 3. MongoDB not running
:: Make sure MongoDB is running on port 27017
```

## **📝 Environment Variables Summary**

**Backend (.env):**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=todo_list_super_secret_key
CLIENT_URL=http://localhost:3000
```

**Frontend (.env):**
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## **🎯 One-Liner to Start Everything (After Setup)**
Open two command prompts and run:

**Command Prompt 1:**
```batch
cd backend && npm run dev
```

**Command Prompt 2:**
```batch
cd frontend && npm start
```

**Done! Open http://localhost:3000 to use the app.**