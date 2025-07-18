import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Header from './components/Header';
import LiveTab from './components/live/LiveTab';
import AttendanceTab from './components/attendance/AttendanceTab';
import FaceTab from './components/faces/Faces';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 2 }} >
        {/* Header Component */}
        <Header title="CCTV Attendance System" />

        {/* MUI Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'left' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="main tabs">
            <Tab label="Live" {...a11yProps(0)} />
            <Tab label="Attendance" {...a11yProps(1)} />
            <Tab label="Faces" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Tab Content Panels */}
        <TabPanel value={activeTab} index={0}>
          <LiveTab />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <AttendanceTab />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <FaceTab />
        </TabPanel>

        {/* Note: Snackbar/Toasts are handled within components for this example */}
      </Container>
    </LocalizationProvider>
  );
}

export default App;