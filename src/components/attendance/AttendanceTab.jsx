import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import { getAttendance } from '../../lib/api';
import { format } from 'date-fns';

function AttendanceTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedDate) return;
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const data = await getAttendance(dateString);
        setAttendanceData(data);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
        showSnackbar("Could not fetch attendance data.", "error");
      }
    };

    fetchAttendance();
  }, [selectedDate]);

  // Handle download action
  const handleDownload = () => {
    if (attendanceData.length === 0) {
      showSnackbar("No attendance data to download.", "warning");
      return;
    }

    console.log("Download triggered for date:", format(selectedDate, 'yyyy-MM-dd'));
    showSnackbar(`Downloading attendance for ${format(selectedDate, "PPP")}. (Mock)`, "info");

    // --- CSV Generation Logic (Example - needs browser environment) ---
    /*
    const headers = ["ID", "Name", "Date", "In Time", "Out Time", "Status"];
    const csvContent = [
      headers.join(","),
      ...attendanceData.map(row => [
        `"${row.id}"`, `"${row.name}"`, `"${row.date}"`,
        `"${row.inTime || 'N/A'}"`, `"${row.outTime || 'N/A'}"`, `"${row.status}"`
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `attendance_${format(selectedDate, 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
        showSnackbar("Download not supported in this browser.", "error");
    }
    */
    // --- End CSV Example ---
  };

  // Determine chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning'; 
      default: return 'default';
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <CardHeader
        title={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} >
            {/* Date Selector */}
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: { sm: 240 } }} />}
            />
            {/* Download Button */}
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              size='medium'
              onClick={handleDownload}
            >
              Download
            </Button>
          </Stack>
        }
        sx={{ '.MuiCardHeader-action': { alignSelf: { xs: 'stretch', sm: 'center' }, mt: { xs: 2, sm: 0 }, ml: { sm: 0 } } }}
      />
      <CardContent sx={{ pt: 1, maxHeight: '70vh', overflow: 'auto' }}>
        {attendanceData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table stickyHeader size="small" aria-label="attendance table">
              <TableHead>
                <TableRow sx={{ fontWeight: 'bold' }} >
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>In Time</TableCell>
                  <TableCell>Out Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={`${record.id}-${record.date}`} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{py: 3}}>{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.inTime || 'N/A'}</TableCell>
                    <TableCell>{record.outTime || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={getStatusChipColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No attendance records found for {selectedDate ? format(selectedDate, "PPP") : 'the selected date'}.
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Showing {attendanceData.length} record(s).
        </Typography>
      </CardActions>
      {/* Snackbar for local notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AttendanceTab;