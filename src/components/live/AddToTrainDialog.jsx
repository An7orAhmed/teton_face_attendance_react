import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { addUnrecognizedToTrainApi } from '../../lib/api';
import { format } from 'date-fns';

function AddToTrainDialog({ isOpen, setIsOpen, unrecognizedFace, showSnackbar, selectedDate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    uniqueId: '',
    name: '',
    photoFile: null,
  });
  const [fileName, setFileName] = useState('');

  // Reset form state
  const resetForm = () => {
    setFormData({ uniqueId: '', name: '', photoFile: null });
    setFileName('');
    setIsSubmitting(false);
  };

  // Effect to reset form when dialog opens or face changes
  useEffect(() => {
    if (isOpen && unrecognizedFace) {
      console.log("Selected unrecognized face:", unrecognizedFace);
      resetForm(); // Reset form when dialog opens with new face data
    }
  }, [unrecognizedFace, isOpen]); // Re-run when dialog opens or face changes

  // Handle text input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, photoFile: file }));
      setFileName(file.name);
    } else {
      setFormData(prev => ({ ...prev, photoFile: null }));
      setFileName('');
    }
  };

  // Handle dialog close
  const handleClose = (event, reason) => {
    if (isSubmitting && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return; // Prevent closing while submitting
    }
    resetForm();
    setIsOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (!formData.uniqueId || !formData.name || !formData.photoFile || !unrecognizedFace?.unknownId) {
      showSnackbar("Please provide Unique ID, Name, select a Photo, and ensure an unrecognized face was selected.", "error");
      setIsSubmitting(false);
      return;
    }

    // Create FormData for API
    const apiFormData = new FormData();
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    apiFormData.append('unknownId', unrecognizedFace.unknownId);
    apiFormData.append('uniqueId', formData.uniqueId);
    apiFormData.append('name', formData.name);
    apiFormData.append('date', dateString);
    apiFormData.append('photo', formData.photoFile);

    try {
      handleClose(); // Close
      const resp = await addUnrecognizedToTrainApi(apiFormData);
      showSnackbar(resp, "info");
    } catch (error) {
      showSnackbar(error.message || "An error occurred while adding the face.", "error");
      setIsSubmitting(false); // Allow retry
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="add-train-dialog-title" disableEscapeKeyDown={isSubmitting}>
      <DialogTitle id="add-train-dialog-title">Add Unrecognized Face to Training</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Assign a Unique ID and Name to this detected face (ID: {unrecognizedFace?.unknownId || 'N/A'}). <br />Upload a photo for training.
          </DialogContentText>
          <TextField
            autoFocus // Focus on first field
            margin="dense"
            id="uniqueId"
            label="Unique ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.uniqueId}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
          {/* File Input */}
          <TextField
            margin="dense"
            id="addPhotoFile" // Unique ID for this input
            label="Photo"
            type="file"
            fullWidth
            variant="outlined"
            required
            onChange={handleFileChange}
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/jpeg" }}
            helperText={fileName || "Select a photo file"}
          />
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Add To Train'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddToTrainDialog; 