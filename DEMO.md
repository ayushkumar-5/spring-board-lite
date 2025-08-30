# 🚀 Sprint Board Lite - Quick Demo Guide

## 🎯 What to Test

### 1. **Authentication** ✅
- Navigate to `http://localhost:3000`
- You'll be redirected to `/login`
- Use any non-empty email/password (e.g., `demo@example.com` / `password`)
- Should redirect to `/board` after successful login

### 2. **Board View** ✅
- **3 Columns**: Todo, In Progress, Done
- **Sample Tasks**: 5 pre-loaded tasks in different columns
- **Task Counts**: Each column shows number of tasks

### 3. **Drag & Drop** ✅
- **Move Tasks**: Drag tasks between columns
- **Visual Feedback**: Tasks rotate and show shadow while dragging
- **Drop Zones**: Columns highlight when dragging over them

### 4. **Undo Move (Variant A-G)** ✅
- Move a task to a different column
- **5-second toast** appears with "Undo" button
- Click "Undo" to revert the move
- Toast disappears after action or timeout

### 5. **Task Management** ✅
- **Create Task**: Click "Create Task" button
- **Edit Task**: Click menu (⋮) on any task → Edit
- **Delete Task**: Click menu (⋮) on any task → Delete
- **Priority**: Low (Green), Medium (Yellow), High (Red)

### 6. **Search & Filter** ✅
- **Search**: Type in search box to filter by title
- **Priority Filter**: Dropdown to filter by priority level
- **Combined**: Search + priority filter work together

### 7. **Dark Mode** ✅
- **Toggle**: Click sun/moon icon in header
- **Persistence**: Theme saved in localStorage
- **System**: Automatically detects system preference

### 8. **Responsive Design** ✅
- **Mobile**: Test on mobile viewport
- **Tablet**: Test on tablet viewport
- **Desktop**: Test on desktop viewport

### 9. **Loading States** ✅
- **Skeletons**: Loading placeholders while fetching data
- **Spinners**: Loading indicators on buttons
- **Error States**: Graceful error handling

### 10. **API Failure Simulation** ✅
- **10% Failure Rate**: Random 500 errors on POST/PATCH
- **Optimistic Updates**: UI updates immediately
- **Rollback**: Automatic state restoration on failure
- **User Feedback**: Error toasts and rollback notifications

## 🧪 Testing Scenarios

### **Scenario 1: Happy Path**
1. Login → Create task → Move task → Edit task → Delete task
2. **Expected**: All operations succeed, proper feedback

### **Scenario 2: API Failures**
1. Perform operations multiple times
2. **Expected**: Some operations fail (10% chance)
3. **Expected**: UI rolls back, error toasts appear

### **Scenario 3: Undo Functionality**
1. Move task between columns
2. **Expected**: Undo toast appears for 5 seconds
3. **Expected**: Clicking undo reverts the move

### **Scenario 4: Search & Filter**
1. Search for specific task title
2. Filter by priority
3. **Expected**: Results update in real-time

### **Scenario 5: Theme Switching**
1. Toggle between light/dark modes
2. Refresh page
3. **Expected**: Theme preference persists

## 🔍 Debug Tips

### **Check Console**
- Frontend: Browser DevTools Console
- Backend: Terminal running json-server

### **Check Network**
- Browser DevTools → Network tab
- Look for API calls to `/api/*`
- Check for 500 errors (simulated failures)

### **Check localStorage**
- Browser DevTools → Application → Storage
- Verify `authToken` and `theme` are saved

## 🚨 Common Issues

### **Port Conflicts**
- Frontend: 3000
- Backend: 3001
- Kill processes: `lsof -ti:3000,3001 | xargs kill`

### **CORS Issues**
- API proxy configured in `vite.config.ts`
- Frontend calls `/api/*` → routes to `localhost:3001`

### **Module Errors**
- Ensure all dependencies installed: `npm install`
- Check Node.js version: `node --version` (16+)

## 🎉 Success Indicators

✅ **Login redirects to board**  
✅ **Tasks load and display**  
✅ **Drag & drop works smoothly**  
✅ **Undo toast appears after moves**  
✅ **Create/edit/delete tasks work**  
✅ **Search and filters work**  
✅ **Dark mode toggles and persists**  
✅ **Mobile responsive design**  
✅ **Loading states and error handling**  
✅ **API failures trigger rollbacks**  

---

**Ready to test? Open http://localhost:3000 and start exploring! 🚀**
