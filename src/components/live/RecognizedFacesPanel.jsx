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
import Avatar from '@mui/material/Avatar'; 

import { getRecognizedFaces } from '../../lib/api'; 
import { format } from 'date-fns';


function RecognizedFacesPanel({ selectedDate, showSnackbar }) { // Receive showSnackbar as prop
  const [recognizedFaces, setRecognizedFaces] = useState([]);

  useEffect(() => {
    const fetchFaces = async () => {
      if (!selectedDate) return;
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const data = await getRecognizedFaces(dateString);
        setRecognizedFaces(data);
      } catch (error) {
         console.error("Failed to fetch recognized faces:", error);
         showSnackbar("Could not fetch recognized faces.", "error"); // Use passed-in handler
      }
    };

    fetchFaces();
    // polling
    const intervalId = setInterval(fetchFaces, 3000);
    return () => clearInterval(intervalId);
  }, [selectedDate, showSnackbar]);

  return (
    <Box sx={{ height: '83vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={`Recognized Faces`} style={{textTransform: 'uppercase'}} />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 1 }}> 
        {recognizedFaces?.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: '100%' }}> 
            <Table stickyHeader size='small' aria-label="recognized faces table"> 
              <TableHead>
                <TableRow sx={{ fontWeight: 'bold' }}>
                  <TableCell>Photo</TableCell> 
                  <TableCell>ID/Name</TableCell>
                  <TableCell>In Time</TableCell>
                  <TableCell>Out Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recognizedFaces.map((face) => (
                  <TableRow key={face.id+face.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 1 }} component="th" scope="row"> 
                        <Avatar src={face.photo} sx={{width: 100, height: 100}} />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>{face.id}<br /><strong>{face.name}</strong></TableCell>
                    <TableCell sx={{ py: 1 }}>{face.inTime}</TableCell>
                    <TableCell sx={{ py: 1 }}>{face.outTime || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
             <Typography color="text.secondary">No recognized faces found for this date.</Typography>
          </Box>
        )}
      </CardContent>
      {/* Snackbar is now handled by the parent (LiveTab) */}
    </Box>
  );
}

export default RecognizedFacesPanel; 