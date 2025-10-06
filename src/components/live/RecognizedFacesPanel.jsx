import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';

import { getRecognizedFaces } from '../../lib/api';
import { format } from 'date-fns';

function RecognizedFacesPanel({ selectedDate }) {
  const [recognizedFaces, setRecognizedFaces] = useState([]);

  useEffect(() => {
    const fetchFaces = async () => {
      if (!selectedDate) return;
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const data = await getRecognizedFaces(dateString);
      setRecognizedFaces(data.reverse()); // Show latest first
    };

    fetchFaces();
    // polling
    const intervalId = setInterval(fetchFaces, 3000);
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      width: 60,
      renderCell: (params) => (
        <Avatar variant="rounded" src={params.value} sx={{ width: 50, height: 50 }} />
      ),
      sortable: false,
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 130,
    },
    {
      field: 'inTime',
      headerName: 'In Time',
      width: 120,
    },
    {
      field: 'outTime',
      headerName: 'Out Time',
      width: 120,
      valueGetter: (value) => value || 'N/A',
    },
  ];

  return (
    <Box sx={{ height:'100%', maxHeight: '80vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Recognized Faces" sx={{ textTransform: 'uppercase' }} />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 0 }}>
        {recognizedFaces?.length > 0 ? (
          <DataGrid
            rows={recognizedFaces.map((face, index) => ({ ...face, id: face.id || index }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{ border: 0, height: '100%'}}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Typography color="text.secondary">No recognized faces found for {format(selectedDate, "PPP")}.</Typography>
          </Box>
        )}
      </CardContent>
    </Box>
  );
}

export default RecognizedFacesPanel; 