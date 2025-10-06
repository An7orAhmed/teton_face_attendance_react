import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventNoteIcon from '@mui/icons-material/EventNote';
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

  const columns = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'inTime', headerName: 'In Time', width: 140, valueGetter: (value) => value || 'N/A' },
    { field: 'outTime', headerName: 'Out Time', width: 140, valueGetter: (value) => value || 'N/A' },
    { field: 'workHour', headerName: 'Work Hours', width: 120, valueGetter: (value) => `${value || 0} Hrs` },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusChipColor(params.value)}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'start' }}>
        <Grid item sx={{ width: 250 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h7" gutterBottom>
                Present
              </Typography>
              <Typography variant="h4" component="div">
                <CheckCircleIcon sx={{ mr: 1, fontSize: 40 }} />
                {presentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sx={{ width: 250 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h7" gutterBottom>
                Absent
              </Typography>
              <Typography variant="h4" component="div">
                <CancelIcon sx={{ mr: 1, fontSize: 40 }} />
                {absentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sx={{ width: 250 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h7" gutterBottom>
                Total Hours
              </Typography>
              <Typography variant="h4" component="div">
                <AccessTimeIcon sx={{ mr: 1, fontSize: 40 }} />
                {totalHours} hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Filters"
          action={
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
              Download CSV
            </Button>
          }
        />
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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

            <DatePicker
              label="Single Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />

            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />

            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ height: '50vh', p: 0 }}>
          <DataGrid
            rows={filteredData.map((row, index) => ({ ...row, id: row.id || index }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{ border: 0, height: '100%' }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', px: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredData.length} record(s).
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
}

export default AttendanceTab;
