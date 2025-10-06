import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
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
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Registered Faces ({faceData?.length || 0})
      </Typography>
      {faceData?.length > 0 ? (
        <Grid container spacing={2}>
          {faceData.map((record, i) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={`${record.ID}-${i}`}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={record.Photo}
                  alt={record.Name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {record.Name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {record.ID}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No faces found.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default FaceTab;