import { useState, useEffect } from 'react';
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
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import AddNewFaceDialog from './AddNewFaceDialog';
import { getStats, HOST, startAttendanceApi, startTrainingApi, stopAttendanceApi } from '../../lib/api';
import { io } from 'socket.io-client';

const socket = io(HOST); // location.port

function LiveVideoPanel({ selectedDate, onDateChange }) {
  const [isTraining, setIsTraining] = useState(false);
  const [isTrainDialogOpen, setIsTrainDialogOpen] = useState(false);
  const [isVideoStreaming, setIsVideoStreaming] = useState(false);
  const [stats, setStats] = useState({ trainedCount: 0, totalImages: 0 });

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
        if (data?.isCapturing || data?.isRecognizing) {
          setIsVideoStreaming(true);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        showSnackbar("Could not fetch statistics.", "error");
      }
    };
    fetchStats();

    socket.on('status_update', function (data) {
      try {
        const json = JSON.parse(data.message);
        if (json?.cam_frame && typeof json.cam_frame !== 'undefined') {
          const imgElement = document.getElementById('video-stream');
          if (imgElement) {
            imgElement.src = `data:image/jpeg;base64,${json?.cam_frame}`;
          }
        } else if (json?.type && typeof json.type === 'string') {
          showSnackbar(`DETECTED: ${json?.id} | ${json?.name}`, "info");
        }
      } catch {
        console.log("Socket:", data.message);
        showSnackbar(data.message, "info");
        if (data.message?.includes('stopped')) {
          setIsVideoStreaming(false);
        } else if (data.message?.includes('Training completed')) {
          setIsTraining(false);
        }
      }
    });

    return () => {
      socket.off('status_update');
    };
  }, []); // Fetch only on mount

  // --- Event Handlers ---
  const handleAddNewFace = () => {
    setIsTrainDialogOpen(true);
    setIsVideoStreaming(true);
  };

  const handleStartTraining = async () => {
    try {
      setIsTraining(true);
      await startTrainingApi();
    } catch (error) {
      console.error("Failed to start training:", error);
      showSnackbar("Could not start training.", "error");
    }
  }

  const handleStartAttendance = async () => {
    try {
      await startAttendanceApi();
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
        backgroundColor: 'grey.300',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'grey.700',
        textAlign: 'center',
        width: '100%',
        height: '300px',
      }}
    >
      {isVideoStreaming ? (
        <Box>
          <img id="video-stream" className="w-full" />
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
    <Box sx={{ maxHeight: '83vh', overflow: 'auto' }}>
      <CardHeader title={`Live Cam`} style={{ textTransform: 'uppercase' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Date Selector - Using MUI X DatePicker */}
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => onDateChange(newValue)}
          slotProps={{ textField: { variant: 'outlined' }, size: 'small', fullWidth: true }}
        />

        {/* Video Preview Area */}
        <VideoPreview />

        {/* Statistics */}
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
          <Grid container spacing={1} justifyContent="space-evenly" alignItems="center" textAlign="center">
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
          <Button onClick={handleAddNewFace} disabled={isTraining || isVideoStreaming} variant="outlined" color="info" size='large' fullWidth>Add New Face</Button>
          <Button onClick={handleStartTraining} disabled={isTraining || isVideoStreaming} variant="outlined" color="error" size='large' fullWidth>Start Training</Button>
          {!isVideoStreaming ? (
            <Button onClick={handleStartAttendance} disabled={isTraining || isVideoStreaming} variant="contained" size='large' color="success" fullWidth>Start Recognition</Button>
          ) : (
            <Button onClick={handleStopAttendance} disabled={isTraining} variant="contained" size='large' color="error" fullWidth>Stop Recognition</Button>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {isVideoStreaming ? 'Attendance Running' : 'Attendance Stopped'}
        </Typography>
      </CardActions>

      {/* Train New Face Dialog */}
      <AddNewFaceDialog isOpen={isTrainDialogOpen} setIsOpen={setIsTrainDialogOpen} showSnackbar={showSnackbar} setIsVideoStreaming={setIsVideoStreaming} />

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