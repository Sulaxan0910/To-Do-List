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
npm install express cors bcryptjs jsonwebtoken mongoose dotenv
npm install -D typescript @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/node ts-node-dev

# Create tsconfig.json (copy-paste this content)
cat > tsconfig.json << 'EOF'
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
EOF

# Create .env file for backend
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
JWT_SECRET=todo_list_super_secret_key_change_this
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
EOF

# Update package.json scripts (add these if not present)
# Add this to the "scripts" section of your package.json:
# "dev": "ts-node-dev src/index.ts",
# "start": "node dist/index.js",
# "build": "tsc"

# Create folder structure
mkdir -p src/{controllers,models,middleware,routes,config}

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
npm install axios react-router-dom

# Create .env file for frontend
cat > .env << 'EOF'
REACT_APP_NAME=ToDoList
REACT_APP_ENV=development
REACT_APP_API_BASE_URL=http://localhost:5000/api
EOF

# Create folder structure
mkdir -p src/{components,pages,context,services,types,utils}

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

### **5. Start Both Servers (Mac/Linux Script)**
Create `start.sh` in the project root:
```bash
#!/bin/bash
echo "🚀 Starting To-Do List Application..."
echo ""

echo "📦 Starting backend server..."
cd backend
npm run dev &

echo "⏳ Waiting for backend to initialize..."
sleep 5

echo "⚛️  Starting frontend server..."
cd ../frontend
npm start &

echo ""
echo "✅ Application is running!"
echo "🌐 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "📝 Use demo account:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
echo ""
echo "Press Ctrl+C to stop servers"
wait
```

Make it executable:
```bash
chmod +x start.sh
```

## **🔧 IMPORTANT: Update MongoDB Connection**

**You MUST update the MONGO_URI in backend/.env:**

1. Get your MongoDB Atlas connection string or use local MongoDB
2. Replace this line in backend/.env:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
   ```
3. With your actual connection string

## **✅ Quick Test**
```bash
# Test backend is running
curl http://localhost:5000/api/health

# Then open in browser
# Frontend: http://localhost:3000
```

## **⚠️ Troubleshooting Quick Fixes**

If you get errors:

```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Port already in use (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# 3. Port already in use (Mac/Linux)
lsof -i :5000
kill -9 <PID>

# 4. CORS errors - restart both servers after updating .env files
```

## **📝 Environment Variables Summary**

**Backend (.env):**
```
PORT=5000
MONGO_URI=your_mongodb_connection_here
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

**Frontend (.env):**
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## **🎯 One-Liner to Start Everything (After Setup)**
```bash
# Open two terminals and run:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm start
```

**Done! Open http://localhost:3000 to use the app.**