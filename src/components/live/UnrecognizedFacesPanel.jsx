import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { getUnrecognizedFaces, startClusterApi } from '../../lib/api';
import { format } from 'date-fns';

function UnrecognizedFacesPanel({ selectedDate, onAddToTrain }) {
  const [unrecognizedFaces, setUnrecognizedFaces] = useState([]);
  const [isClustering, setIsClustering] = useState(false);
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  useEffect(() => {
    const fetchFaces = async () => {
      if (!selectedDate) return;
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const data = await getUnrecognizedFaces(dateString);
      setUnrecognizedFaces(data.reverse()); // Show latest first
    };

    fetchFaces();
    // polling
    const intervalId = setInterval(fetchFaces, 3000);
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  const handleClusterBtn = async () => {
    setIsClustering(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    await startClusterApi(dateString);
    setIsClustering(false);
  }

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      width: 80,
      renderCell: (params) => (
        <Avatar variant="rounded" src={params.value} sx={{ width: 60, height: 60 }} />
      ),
      sortable: false,
    },
    {
      field: 'unknownId',
      headerName: 'ID',
      width: 120,
    },
    {
      field: 'detectTime',
      headerName: 'Detect Time',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        isAdmin && params.row.detectTime === 'unknown' ? (
          <Button size="small" variant="outlined" color="info" onClick={() => onAddToTrain(params.row)}>
            Train
          </Button>
        ) : null
      ),
      sortable: false,
    },
  ];

  return (
    <Box sx={{ maxHeight: '87vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
          Unrecognized Faces
        </Typography>
        {isAdmin && (
          <Button size="small" variant="outlined" disabled={isClustering} color="error" onClick={handleClusterBtn}>
            {isClustering ? 'Processing..' : 'Cluster'}
          </Button>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 0 }}>
        {unrecognizedFaces?.length > 0 ? (
          <DataGrid
            rows={unrecognizedFaces.map((face, index) => ({ ...face, id: face.unknownId || index }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{ border: 0, height: '100%' }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Typography color="text.secondary">
              No unrecognized faces detected for {format(selectedDate, 'PPP')}.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Box>
  );
}

export default UnrecognizedFacesPanel; 