import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import TrainNewFaceDialog from './TrainNewFaceDialog';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { getStats, startAttendanceApi, stopAttendanceApi } from '../../lib/api';
import { format } from "date-fns";
import { io } from 'socket.io-client';

const socket = io(`http://${location.hostname}:${location.port}`);

function LiveVideoPanel({ selectedDate, onDateChange }) {
  const [isTrainDialogOpen, setIsTrainDialogOpen] = useState(false);
  const [isAttendanceRunning, setIsAttendanceRunning] = useState(false);
  const [isVideoStreaming, setIsVideoStreaming] = useState(false);
  const [stats, setStats] = useState({ trainedCount: 0, totalImages: 0 });
  const currentTime = useCurrentTime();

  // --- Snackbar State ---
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        showSnackbar("Could not fetch statistics.", "error");
      }
    };
    fetchStats();

    socket.on('status_update', function (data) {
      console.log("Socket:", data.message);
    });

    return () => {
      socket.off('status_update');
    };
  }, []); // Fetch only on mount

  // --- Event Handlers ---
  const handleTrainNewFace = () => {
    setIsTrainDialogOpen(true);
  };

  const handleStartTraining = () => {
    if (isVideoStreaming) {
      showSnackbar("Please stop capture/recognition.", "info");
      return;
    }
  }

  const handleStartAttendance = async () => {
    try {
      await startAttendanceApi();
      setIsAttendanceRunning(true);
      setIsVideoStreaming(true);
      showSnackbar("Attendance started.", "success");
    } catch (error) {
      console.error("Failed to start attendance:", error);
      showSnackbar("Could not start attendance.", "error");
    }
  };

  const handleStopAttendance = async () => {
    try {
      await stopAttendanceApi();
      setIsAttendanceRunning(false);
      setIsVideoStreaming(false);
      showSnackbar("Attendance stopped.", "info");
    } catch (error) {
      console.error("Failed to stop attendance:", error);
      showSnackbar("Could not stop attendance.", "error");
    }
  };

  // --- Video Placeholder ---
  const VideoPreview = () => (
    <Box
      sx={{
        aspectRatio: '16 / 9',
        backgroundColor: '#2a3a3d',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'grey.400',
        textAlign: 'center',
        width: '100%',
      }}
    >
      {isVideoStreaming ? (
        <Box>
          <img id="video-stream" src="/video_feed" class="w-full" />
        </Box>
      ) : (
        <Box>
          <VideocamOffIcon sx={{ fontSize: 60 }} />
          <Typography>Video Feed Inactive</Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: '83vh', overflow: 'auto' }}>
      <CardHeader title={`Live Cam`} style={{ textTransform: 'uppercase' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Date Selector - Using MUI X DatePicker */}
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => onDateChange(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
        />

        {/* Video Preview Area */}
        <VideoPreview />

        {/* Statistics */}
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
          <Grid container spacing={1} justifyContent="space-evenly" alignItems="center" textAlign="center">
            <Grid size={4}>
              <Typography variant="h6" component="p">{format(currentTime, "hh:mm:ss")}</Typography>
              <Typography variant="caption" color="text.secondary">Current Time</Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="h6" component="p">{stats.trainedCount}</Typography>
              <Typography variant="caption" color="text.secondary">Trained Faces</Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="h6" component="p">{stats.totalImages}</Typography>
              <Typography variant="caption" color="text.secondary">Total Images</Typography>
            </Grid>
          </Grid>
        </Box>


        {/* Action Buttons */}
        <Stack spacing={2} direction="column">
          <Button onClick={handleTrainNewFace} variant="outlined" color="warning" size='large' fullWidth>Add New Face</Button>
          <Button onClick={handleStartTraining} variant="outlined" color="error" size='large' fullWidth>Start Training</Button>
          {!isAttendanceRunning ? (
            <Button onClick={handleStartAttendance} variant="contained" size='large' color="success" fullWidth>Start Recognition</Button>
          ) : (
            <Button onClick={handleStopAttendance} variant="contained" size='large' color="error" fullWidth>Stop Recognition</Button>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {isAttendanceRunning ? 'Attendance Running' : 'Attendance Stopped'}
        </Typography>
      </CardActions>

      {/* Train New Face Dialog */}
      <TrainNewFaceDialog isOpen={isTrainDialogOpen} setIsOpen={setIsTrainDialogOpen} showSnackbar={showSnackbar} />

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}


export default LiveVideoPanel; 