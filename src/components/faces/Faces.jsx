import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getAllFaces } from '../../lib/api';

function FaceTab() {
  const [faceData, setFaceData] = useState([]);

  // Fetch attendance data
  useEffect(() => {
    const fetchFace = async () => {
      const faces = await getAllFaces();
      setFaceData(faces);
    };

    fetchFace();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <CardContent sx={{ pt: 1, maxHeight: '88vh', overflow: 'auto' }}>
        {faceData?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table stickyHeader size="small" aria-label="faces table">
              <TableHead>
                <TableRow sx={{ fontWeight: 'bold' }} >
                  <TableCell>Photo</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faceData.map((record, i) => (
                  <TableRow key={`${record.ID}-${i}`} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell className='w-36' component="th" scope="row"><img src={record.Photo} width={100} height={100} className='rounded-xl' /></TableCell>
                    <TableCell>{record.ID}</TableCell>
                    <TableCell>{record.Name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No faces found.
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Showing {faceData?.length} face(s).
        </Typography>
      </CardActions>
    </Box>
  );
}

export default FaceTab;