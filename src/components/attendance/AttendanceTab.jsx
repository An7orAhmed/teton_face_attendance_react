import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DownloadIcon from '@mui/icons-material/Download';
import { getRecognizedFaces } from '../../lib/api';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

function AttendanceTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch attendance data (by single date)
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        if (!selectedDate) return;
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const data = await getRecognizedFaces(dateString);
        setAttendanceData(data.reverse());
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch attendance.");
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  // Apply filters (person + date range)
  const filteredData = attendanceData.filter((row) => {
    const matchPerson = selectedPerson ? row.name === selectedPerson : true;
    let matchDate = true;

    if (startDate && endDate) {
      try {
        const recordDate = parseISO(row.date);
        matchDate = isWithinInterval(recordDate, { start: startDate, end: endDate });
      } catch {
        matchDate = true;
      }
    }

    return matchPerson && matchDate;
  });

  // Summary stats
  const totalHours = filteredData.reduce((sum, r) => sum + (r.workHour || 0), 0);
  const presentCount = filteredData.filter((r) => r.status === 'Present').length;
  const absentCount = filteredData.filter((r) => r.status === 'Absent').length;

  // Download CSV
  const handleDownload = () => {
    if (filteredData.length === 0) {
      toast.warning("No attendance to download.");
      return;
    }

    const headers = ["Date", "ID", "Name", "In Time", "Out Time", "Work Hours", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(r => [
        `"${r.date}"`, `"${r.id}"`, `"${r.name}"`,
        `"${r.inTime || 'N/A'}"`, `"${r.outTime || 'N/A'}"`,
        `"${r.workHour || 0}"`, `"${r.status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  const uniquePersons = [...new Set(attendanceData.map(r => r.name))];

  return (
    <Box sx={{ width: '100%' }}>
      <CardHeader
        title={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Person Filter */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Person</InputLabel>
              <Select
                value={selectedPerson}
                label="Person"
                onChange={(e) => setSelectedPerson(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {uniquePersons.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Single Date Picker */}
            <DatePicker
              label="Single Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />

            {/* Start Date Picker */}
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />

            {/* End Date Picker */}
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />

            {/* Download */}
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
              Download
            </Button>
          </Stack>
        }
      />
      <CardContent sx={{ pt: 1, maxHeight: '70vh', overflow: 'auto' }}>
        {filteredData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>In</TableCell>
                  <TableCell>Out</TableCell>
                  <TableCell>Work Hours</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((rec) => (
                  <TableRow key={`${rec.id}-${rec.date}`}>
                    <TableCell>{rec.date}</TableCell>
                    <TableCell>{rec.id}</TableCell>
                    <TableCell>{rec.name}</TableCell>
                    <TableCell>{rec.inTime || "N/A"}</TableCell>
                    <TableCell>{rec.outTime || "N/A"}</TableCell>
                    <TableCell>{rec.workHour || 0} Hrs</TableCell>
                    <TableCell>
                      <Chip
                        label={rec.status}
                        color={getStatusChipColor(rec.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>No data found.</Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Showing {filteredData.length} record(s).
        </Typography>
        <Typography variant="body2">
          Total: {totalHours} hrs | Present: {presentCount} | Absent: {absentCount}
        </Typography>
      </CardActions>
    </Box>
  );
}

export default AttendanceTab;
