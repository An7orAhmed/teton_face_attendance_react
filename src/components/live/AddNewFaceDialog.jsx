import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { addNewFaceApi } from '../../lib/api';


function AddNewFaceDialog({ isOpen, setIsOpen, showSnackbar, setIsVideoStreaming }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    uniqueId: '',
    name: '',
    photoFile: null,
    captureDelay: 500,
    captureCount: 10,
  });
  const [fileName, setFileName] = useState('');

  // Reset form state
  const resetForm = () => {
    setFormData({ uniqueId: '', name: '', photoFile: null, captureDelay: 500, captureCount: 10 });
    setFileName('');
    setIsSubmitting(false); // Ensure submitting state is reset
  };

  // Handle text/number input changes
  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }));
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

  // Handle dialog close event
  const handleClose = (event, reason) => {
    if (isSubmitting && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    resetForm(); 
    setIsOpen(false);
    if (!isSubmitting && event?.target?.innerText === "CANCEL") setIsVideoStreaming(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation (MUI TextFields handle 'required' visually)
    if (!formData.uniqueId || !formData.name || !formData.photoFile || formData.captureDelay <= 0 || formData.captureCount <= 0) {
      showSnackbar("Please fill all fields and ensure delay/count are positive.", "error");
      setIsSubmitting(false);
      return;
    }

    // Create FormData for API
    const apiFormData = new FormData();
    apiFormData.append('uniqueId', formData.uniqueId);
    apiFormData.append('name', formData.name);
    apiFormData.append('photo', formData.photoFile);
    apiFormData.append('captureDelay', formData.captureDelay.toString());
    apiFormData.append('captureCount', formData.captureCount.toString());

    try {
      handleClose(); // Close dialog
      await addNewFaceApi(apiFormData);
    } catch (error) {
      showSnackbar(error.message || "An error occurred during adding.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="train-face-dialog-title" disableEscapeKeyDown={isSubmitting}>
      <DialogTitle id="train-face-dialog-title">Add New Face</DialogTitle>
      {/* Use form element for proper semantics and submission */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details for the new person and upload a clear photo.
          </DialogContentText>
          <TextField
            autoFocus
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
          <TextField
            margin="dense"
            id="captureDelay"
            label="Capture Delay (ms)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.captureDelay}
            onChange={handleInputChange}
            required
            InputProps={{ inputProps: { min: 1 } }}
            disabled={isSubmitting}
          />
          <TextField
            margin="dense"
            id="captureCount"
            label="Capture Count"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.captureCount}
            onChange={handleInputChange}
            required
            InputProps={{ inputProps: { min: 1 } }}
            disabled={isSubmitting}
          />
          {/* File Input */}
          <TextField
            margin="dense"
            id="photoFile"
            label="Photo"
            type="file"
            fullWidth
            variant="outlined"
            required
            onChange={handleFileChange}
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true }} // Keep label floated
            inputProps={{ accept: "image/jpeg" }} // Specify accepted file types
            helperText={fileName || "Select a photo file"} // Show filename or helper text
          />

        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}> {/* Add padding to actions */}
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Add Face'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddNewFaceDialog;