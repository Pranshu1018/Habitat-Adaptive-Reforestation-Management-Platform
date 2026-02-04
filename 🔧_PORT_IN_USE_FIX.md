# 🔧 FIX: Port 3001 Already in Use

## 🚨 ERROR

```
Error: listen EADDRINUSE: address already in use :::3001
```

This means another Node.js process is already using port 3001.

---

## ✅ QUICK FIX (3 Options)

### Option 1: Use Helper Script (Easiest)
```bash
restart-backend.bat
```
This automatically kills Node processes and restarts the backend.

### Option 2: Kill Node Manually
```bash
# Kill all Node processes
kill-node.bat

# Then restart backend
cd backend
npm run dev
```

### Option 3: PowerShell Command
```powershell
# Kill Node processes
Get-Process -Name node | Stop-Process -Force

# Restart backend
cd backend
npm run dev
```

---

## 🔍 FIND WHAT'S USING PORT 3001

### Windows CMD:
```cmd
netstat -ano | findstr :3001
```

This shows the PID (Process ID) using port 3001.

### Kill Specific Process:
```cmd
taskkill /PID <PID> /F
```

Replace `<PID>` with the actual process ID.

---

## 🎯 RECOMMENDED WORKFLOW

### Starting Fresh:

1. **Kill all Node processes**:
   ```bash
   kill-node.bat
   ```

2. **Start backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start frontend** (in new terminal):
   ```bash
   npm run dev
   ```

---

## 🔄 ALTERNATIVE: Use Different Port

If you want to use a different port:

### Edit `backend/.env`:
```env
PORT=3002
```

### Update frontend API calls:
```typescript
// src/services/api/config.ts
const API_BASE_URL = 'http://localhost:3002/api';
```

---

## 🛠️ HELPER SCRIPTS CREATED

### 1. `kill-node.bat`
Kills all Node.js processes.

### 2. `restart-backend.bat`
Kills Node processes and restarts backend automatically.

### 3. `start.bat` (existing)
Starts both backend and frontend together.

---

## ✅ VERIFY IT WORKS

After restarting, you should see:
```
🌳 Habitat Backend API running on port 3001
📊 Environment: development
🔗 Health check: http://localhost:3001/health
```

Test it:
```bash
curl http://localhost:3001/health
```

---

## 🚀 BEST PRACTICE

### Always use `start.bat` to start the system:
```bash
start.bat
```

This handles:
- ✅ Killing existing processes
- ✅ Starting backend on port 3001
- ✅ Starting frontend on port 5173
- ✅ Opening in separate windows

---

## 📝 SUMMARY

**Problem**: Port 3001 already in use
**Solution**: Kill Node processes with `kill-node.bat` or `restart-backend.bat`
**Prevention**: Use `start.bat` to start the system cleanly

**Now restart the backend and it will work!** 🎉
