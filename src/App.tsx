import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Login from './pages/Login';
import Board from './pages/ModernBoard';
import DragTestPage from './pages/DragTestPage';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import './utils/offlineTest'; // Import for testing utilities

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/board" 
              element={
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test" 
              element={
                <ProtectedRoute>
                  <DragTestPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/board" replace />} />
          </Routes>
          <ToastContainer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
