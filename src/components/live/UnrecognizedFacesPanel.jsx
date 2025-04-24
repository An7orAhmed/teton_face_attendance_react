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
import Avatar from '@mui/material/Avatar';

import { getUnrecognizedFaces } from '../../lib/api';
import { format } from 'date-fns';

function UnrecognizedFacesPanel({ selectedDate, onAddToTrain }) {
  const [unrecognizedFaces, setUnrecognizedFaces] = useState([]);

  useEffect(() => {
    const fetchFaces = async () => {
      if (!selectedDate) return;
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const data = await getUnrecognizedFaces(dateString);
      setUnrecognizedFaces(data);
    };

    fetchFaces();
    // polling
    const intervalId = setInterval(fetchFaces, 3000);
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  return (
    <Box sx={{ maxHeight: '83vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={`Unrecognized Faces`} style={{ textTransform: 'uppercase' }} />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {unrecognizedFaces?.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
            <Table stickyHeader size="small" aria-label="unrecognized faces table">
              <TableHead>
                <TableRow sx={{ fontWeight: 'bold' }}>
                  <TableCell>Photo</TableCell>
                  <TableCell>ID/Detect Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unrecognizedFaces.map((face) => (
                  <TableRow key={face.unknownId + face.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 1 }} component="th" scope="row">
                      <Avatar variant='rounded' src={face.photo} sx={{ width: 100, height: 100 }} />
                    </TableCell>
                    <TableCell>
                      <span className='italic text-gray-400'>{face.unknownId}</span><br />
                      <span className='text-md font-bold'>{face.detectTime}</span>
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" color='secondary' onClick={() => onAddToTrain(face)}>
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
            <Typography color="text.secondary">No unrecognized faces detected for {format(selectedDate, "PPP")}.</Typography>
          </Box>
        )}
      </CardContent>
    </Box>
  );
}

export default UnrecognizedFacesPanel; 