import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Sidebar from './components/Sidebar';
import LiveTab from './components/live/LiveTab';
import AttendanceTab from './components/attendance/AttendanceTab';
import FaceTab from './components/faces/Faces';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';


function MainApp() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/app/live':
        return 'Live Monitoring';
      case '/app/attendance':
        return 'Attendance Records';
      case '/app/faces':
        return 'Face Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFD' }}>
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#F8FAFD' }}>
          <Typography variant="h4" component="h1" sx={{ pb: 3, pl: 3, color: 'primary.main', fontWeight: 'bold' }}>
            {getPageTitle()}
          </Typography>
          <Outlet />
        </Box>
      </Box>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </LocalizationProvider>
  );
}

function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, [location]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/app" />} />
      <Route path="/app" element={<MainApp />}>
        <Route index element={<Navigate to="/app/live" />} />
        <Route path="live" element={<LiveTab />} />
        <Route path="attendance" element={<AttendanceTab />} />
        <Route path="faces" element={<FaceTab />} />
      </Route>
      <Route path="/" element={<Navigate to="/app" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
}

export default App;