import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { addNewFaceApi } from '../../lib/api';

// --- Drag & Drop Component ---
function ImageDropzone({ onFilesSelected }) {
  const [count, setCount] = useState(0);

  const handleFiles = (files) => {
    const accepted = Array.from(files).filter(file =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );
    if (accepted.length) {
      setCount(accepted.length);
      onFilesSelected(accepted);
    }
  };

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
    >
      <p className="text-sm text-gray-500">Drag & drop images here</p>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input" className="cursor-pointer text-blue-600 hover:underline">
        Choose Files
      </label>
      <p className="mt-2 text-gray-700 font-medium">{count} files selected</p>
    </div>
  );
}

function AddNewFaceDialog({ isOpen, setIsOpen, setIsVideoStreaming }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    uniqueId: '',
    name: '',
    photoFile: null, // required
    captureDelay: 500,
    captureCount: 10,
  });
  const [fileName, setFileName] = useState('');
  const [dropzoneFiles, setDropzoneFiles] = useState([]);

  const resetForm = () => {
    setFormData({ uniqueId: '', name: '', photoFile: null, captureDelay: 500, captureCount: 10 });
    setFileName('');
    setDropzoneFiles([]);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value
    }));
  };

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

  const handleDropzoneFiles = (files) => {
    setDropzoneFiles(files);
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    resetForm();
    setIsOpen(false);
    if (!isSubmitting && event?.target?.innerText === "CANCEL") setIsVideoStreaming(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required: uniqueId, name, photoFile
    if (!formData.uniqueId || !formData.name || !formData.photoFile) {
      toast.error("Unique ID, Name, and a Photo file are required.");
      setIsSubmitting(false);
      return;
    }

    // Either capture OR dropzone must be valid
    const usingDropzone = dropzoneFiles.length > 0;
    const usingCapture = formData.captureDelay > 0 && formData.captureCount > 0;

    if (!usingDropzone && !usingCapture) {
      toast.error("Please provide Capture Delay & Count OR upload multiple photos.");
      setIsSubmitting(false);
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append('uniqueId', formData.uniqueId);
    apiFormData.append('name', formData.name);
    apiFormData.append('photo', formData.photoFile);

    if (usingDropzone) {
      dropzoneFiles.forEach((file) => {
        apiFormData.append('photos', file);
      });
    } else {
      apiFormData.append('captureDelay', formData.captureDelay.toString());
      apiFormData.append('captureCount', formData.captureCount.toString());
    }

    try {
      handleClose();
      await addNewFaceApi(apiFormData);
    } catch (error) {
      toast.error(error.message || "An error occurred during adding.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="train-face-dialog-title" disableEscapeKeyDown={isSubmitting}>
      <DialogTitle id="train-face-dialog-title">Add New Face</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter details, upload a single photo (required), then choose either auto capture OR upload multiple photos.
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

          {/* Single Photo (always required) */}
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
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/jpeg" }}
            helperText={fileName || "Select a profile photo file"}
          />

          {/* Capture OR Dropzone */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <TextField
                margin="dense"
                id="captureDelay"
                label="Capture Delay (ms)"
                type="number"
                variant="outlined"
                value={formData.captureDelay}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
                disabled={isSubmitting || dropzoneFiles.length > 0}
              />
              <TextField
                margin="dense"
                id="captureCount"
                label="Capture Count"
                type="number"
                variant="outlined"
                value={formData.captureCount}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
                disabled={isSubmitting || dropzoneFiles.length > 0}
              />
            </div>
            <p className="font-semibold">OR</p>
            <div className="w-1/2">
              <ImageDropzone onFilesSelected={handleDropzoneFiles} />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
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
