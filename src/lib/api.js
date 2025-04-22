
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let mockStats = { trainedCount: 5, totalImages: 150 };

let mockRecognized = {
  "2025-04-22": [
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:25 AM', outTime: null, photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:28 AM', outTime: null, photo: null },
  ],
  "2025-04-21": [
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
    { id: 'EMP001', name: 'Alice Smith', inTime: '08:30 AM', outTime: '05:05 PM', photo: null },
    { id: 'EMP002', name: 'Charlie Brown', inTime: '09:00 AM', outTime: '05:00 PM', photo: null },
    { id: 'EMP003', name: 'Bob Johnson', inTime: '08:35 AM', outTime: '04:55 PM', photo: null },
  ]
};

let mockUnrecognized = {
  "2025-04-22": [
    { unknownId: 'PERSON_1', detectTime: '08:29 AM', photo: null },
    { unknownId: 'PERSON_2', detectTime: '08:30 AM', photo: null },
  ],
  "2025-04-21": []
};

let mockAttendance = {
  "2025-04-22": [
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-22', inTime: '08:25 AM', outTime: null, status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-22', inTime: '08:28 AM', outTime: null, status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-22', inTime: null, outTime: null, status: 'Absent' },
  ],
  "2025-04-21": [
    { id: 'EMP001', name: 'Alice Smith', date: '2025-04-21', inTime: '08:30 AM', outTime: '05:05 PM', status: 'Present' },
    { id: 'EMP002', name: 'Charlie Brown', date: '2025-04-21', inTime: '09:00 AM', outTime: '05:00 PM', status: 'Present' },
    { id: 'EMP003', name: 'Bob Johnson', date: '2025-04-21', inTime: '08:35 AM', outTime: '04:55 PM', status: 'Present' },
  ]
};

export const getStats = async () => {
  await delay(300);
  console.log("API: Fetching stats");
  return mockStats;
};

export const getRecognizedFaces = async (dateString) => {
  await delay(500);
  console.log(`API: Fetching recognized faces for ${dateString}`);
  return mockRecognized[dateString] || [];
};

export const getUnrecognizedFaces = async (dateString) => {
  await delay(600);
  console.log(`API: Fetching unrecognized faces for ${dateString}`);
  return mockUnrecognized[dateString] || [];
};

export const getAttendance = async (dateString) => {
  await delay(700);
  console.log(`API: Fetching attendance for ${dateString}`);
  return mockAttendance[dateString] || [];
};

export const startAttendanceApi = async () => {
  await delay(400);
  console.log("API: Starting attendance");
  return { success: true, message: "Attendance started" };
};

export const stopAttendanceApi = async () => {
  await delay(400);
  console.log("API: Stopping attendance");
  return { success: true, message: "Attendance stopped" };
};

export const trainNewFaceApi = async (formData) => {
  await delay(1500);
  const name = formData.get('name');
  const uniqueId = formData.get('uniqueId');
  console.log(`API: Training new face: ${name} (ID: ${uniqueId})`);
  mockStats.trainedCount += 1;
  mockStats.totalImages += parseInt(formData.get('captureCount') || '10', 10);
  return { success: true, message: `Training started for ${name}` };
};

export const addUnrecognizedToTrainApi = async (formData) => {
  await delay(1200);
  const name = formData.get('name');
  const uniqueId = formData.get('uniqueId');
  const unknownId = formData.get('unknownId');
  console.log(`API: Adding unrecognized face ${unknownId} as ${name} (ID: ${uniqueId})`);
  mockStats.trainedCount += 1;
  return { success: true, message: `Added ${name} to training queue.` };
};