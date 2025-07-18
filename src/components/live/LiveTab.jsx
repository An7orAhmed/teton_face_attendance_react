import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
      <Grid container direction="row" spacing={1} sx={{
        justifyContent: "space-evenly",
        alignItems: "flex-start",
      }}>
        {/* Column 1: Live Video Panel */}
        <Grid size={{sm: 12, md: 4}}>
          <LiveVideoPanel selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </Grid>

        {/* Column 2: Recognized Faces Panel */}
        <Grid size={{sm: 12, md: 4}}>
          <RecognizedFacesPanel selectedDate={selectedDate} />
        </Grid>

        {/* Column 3: Unrecognized Faces Panel */}
        <Grid size={{sm: 12, md: 4}}>
          <UnrecognizedFacesPanel selectedDate={selectedDate} onAddToTrain={handleAddToTrainClick} />
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