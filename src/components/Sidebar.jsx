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
        className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0`}
        PaperProps={{
          className: `${collapsed ? 'w-16' : 'w-60'} box-border bg-slate-800 text-white transition-all duration-300 overflow-x-hidden`,
        }}
      >
        <Box className={`p-${collapsed ? 1 : 2} flex items-center ${collapsed ? 'justify-center' : 'justify-between'} ${collapsed ? 'min-h-16' : 'min-h-32'}`}>
          {!collapsed && (
            <Box className="text-center flex-grow">
              <div className='flex items-center justify-between'>
                <img src={Logo} alt="Logo" style={{ width: '100%', maxWidth: '150px' }} />
                <IconButton
                  onClick={toggleCollapsed}
                  className="text-white bg-white/10 hover:bg-white/20"
                >
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Typography variant="h6" className="pt-2 text-black/70">
                AI Attendance System
              </Typography>
            </Box>
          )}
          {collapsed && <IconButton
            onClick={toggleCollapsed}
            className="text-white bg-white/10 hover:bg-white/20"
          >
            <ChevronRightIcon />
          </IconButton>}
        </Box>
        {!collapsed && <Divider className="bg-white/20" />}
        <List className={`${collapsed ? 'mt-2' : ''}`}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                className={`${collapsed ? 'justify-center' : ''} hover:bg-white/10 ${location.pathname === item.path ? 'bg-white/20 hover:bg-white/30' : ''}`}
              >
                <ListItemIcon className={`text-white ${collapsed ? 'min-w-0' : 'min-w-14'}`}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Box className="p-2">
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
            className={`bg-yellow-500 hover:bg-yellow-600 ${collapsed ? 'min-w-12 px-1' : ''}`}
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