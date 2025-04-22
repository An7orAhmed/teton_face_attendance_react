import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar'; 

import { getUnrecognizedFaces } from '../../lib/api';
import { format } from 'date-fns';

function UnrecognizedFacesPanel({ selectedDate, onAddToTrain }) {
  const [unrecognizedFaces, setUnrecognizedFaces] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

   const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchFaces = async () => {
       if (!selectedDate) return;
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const data = await getUnrecognizedFaces(dateString);
        setUnrecognizedFaces(data);
      } catch (error) {
         console.error("Failed to fetch unrecognized faces:", error);
         showSnackbar("Could not fetch unrecognized faces.");
      }
    };

    fetchFaces();
    // polling
    const intervalId = setInterval(fetchFaces, 3000);
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  return (
    <Box sx={{ minHeight: '83vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={`Unrecognized Faces`} style={{textTransform: 'uppercase'}} />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {unrecognizedFaces.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: '100%' }}> 
            <Table stickyHeader size="small" aria-label="unrecognized faces table">
              <TableHead>
                <TableRow sx={{ fontWeight: 'bold' }}>
                  <TableCell>Photo</TableCell> 
                  <TableCell>Unknown ID</TableCell>
                  <TableCell>Detect Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unrecognizedFaces.map((face) => (
                  <TableRow key={face.unknownId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 1 }}> 
                      <Avatar src={face.photo} sx={{width: 100, height: 100}} />
                    </TableCell>
                    <TableCell component="th" scope="row">{face.unknownId}</TableCell>
                    <TableCell>{face.detectTime}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => onAddToTrain(face)}>
                        Train
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
             <Typography color="text.secondary">No unrecognized faces detected for this date.</Typography>
          </Box>
        )}
      </CardContent>
       {/* Snackbar for local notifications */}
       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UnrecognizedFacesPanel; 