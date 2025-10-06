import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LiveVideoPanel from './LiveVideoPanel';
import RecognizedFacesPanel from './RecognizedFacesPanel';
import UnrecognizedFacesPanel from './UnrecognizedFacesPanel';
import AddToTrainDialog from './AddToTrainDialog';

function LiveTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddToTrainOpen, setIsAddToTrainOpen] = useState(false);
  const [selectedUnrecognizedFace, setSelectedUnrecognizedFace] = useState(null);

  const handleAddToTrainClick = (face) => {
    setSelectedUnrecognizedFace(face);
    setIsAddToTrainOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container direction="row" spacing={2} sx={{
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        p: 2,
      }}>
        {/* Column 1: Live Video Panel */}
        <Grid size={{sm: 12, md: 4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1, height: '100%' }}>
              <LiveVideoPanel selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </CardContent>
          </Card>
        </Grid>

        {/* Column 2: Recognized Faces Panel */}
        <Grid size={{sm: 12, md: 4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1, height: '100%' }}>
              <RecognizedFacesPanel selectedDate={selectedDate} />
            </CardContent>
          </Card>
        </Grid>

        {/* Column 3: Unrecognized Faces Panel */}
        <Grid size={{sm: 12, md: 4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1, height: '100%' }}>
              <UnrecognizedFacesPanel selectedDate={selectedDate} onAddToTrain={handleAddToTrainClick} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add to Train Dialog (conditionally rendered) */}
      {selectedUnrecognizedFace && (
        <AddToTrainDialog
          isOpen={isAddToTrainOpen}
          setIsOpen={setIsAddToTrainOpen}
          unrecognizedFace={selectedUnrecognizedFace}
          selectedDate={selectedDate}
        />
      )}
    </Box>
  );
}

export default LiveTab;