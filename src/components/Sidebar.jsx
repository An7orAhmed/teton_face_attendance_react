import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Videocam as LiveIcon,
  EventNote as AttendanceIcon,
  Face as FaceIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import Logo from '../assets/Logo.png';


const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems = [
    { text: 'Live', icon: <LiveIcon />, path: '/app/live' },
    { text: 'Attendance', icon: <AttendanceIcon />, path: '/app/attendance' },
    { text: 'Faces', icon: <FaceIcon />, path: '/app/faces' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    setLogoutDialogOpen(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };


  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? 64 : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? 64 : 240,
            boxSizing: 'border-box',
            bgcolor: 'grey.900',
            color: 'white',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            p: collapsed ? 1 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            minHeight: collapsed ? 64 : 128,
          }}
        >
          {!collapsed && (
            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <img src={Logo} alt="Logo" style={{ width: '100%', maxWidth: '150px' }} />
                <IconButton
                  onClick={toggleCollapsed}
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ pt: 2, color: 'grey.300' }}>
                AI Attendance System
              </Typography>
            </Box>
          )}
          {collapsed && (
            <IconButton
              onClick={toggleCollapsed}
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>
        {!collapsed && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
        <List sx={{ mt: collapsed ? 1 : 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  justifyContent: collapsed ? 'center' : 'initial',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  ...(location.pathname === item.path && {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  }),
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: collapsed ? 0 : 56 }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
            sx={{
              bgcolor: 'warning.main',
              '&:hover': { bgcolor: 'warning.dark' },
              minWidth: collapsed ? 48 : 'auto',
              px: collapsed ? 1 : 'auto',
            }}
          >
            {!collapsed && 'Logout'}
          </Button>
        </Box>
      </Drawer>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout? This will clear your session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;