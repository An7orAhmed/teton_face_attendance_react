
export const HOST = 'http://192.168.0.131:5000';

function makePhotoURL(data, key) {
  return data.map((item) => ({
    ...item,
    [key]: HOST + "/file" + item[key]
  }));
}

function determineStatus(inTime, outTime) {
  if (inTime === '' || outTime === '') return "Absent";
  if (inTime === outTime) return "Absent";

  const inHour = parseInt(inTime.split(":")[0], 10);
  const inMinute = parseInt(inTime.split(":")[1], 10);
  const outHour = parseInt(outTime.split(":")[0], 10);

  // Compare with 10:00 AM
  if (inHour > 10 || (inHour === 10 && inMinute > 0)) {
    return "Late";
  }

  if(inHour === outHour) {
    return "Absent";
  }

  return "Present";
}

export async function getAllFaces() {
  try {
    const resp = await fetch(`${HOST}/faces`);
    const data = await resp.json();
    const modifiedData = makePhotoURL(data, 'Photo');
    return modifiedData;
  } catch (error) {
    console.error("Error fetching all faces:", error);
    throw error;
  }
}

export async function getStats() {
  try {
    const resp = await fetch(`${HOST}/stats`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

export async function addNewFaceApi(apiFormData) {
  try {
    const resp = await fetch(`${HOST}/add_face`, {
      method: 'POST',
      body: apiFormData,
    });

    const result = await resp.json();
    return result;
  } catch (error) {
    console.error("Error adding new face:", error);
    throw error;
  }
}

export async function addUnrecognizedToTrainApi(apiFormData) {
  try {
    const resp = await fetch(`${HOST}/add_unrecognized`, {
      method: 'POST',
      body: apiFormData,
    });

    const result = await resp.json();
    return result;
  } catch (error) {
    console.error("Error adding unrecognized face to train:", error);
    throw error;
  }
}

export async function startTrainingApi() {
  try {
    const resp = await fetch(`${HOST}/start_training`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error starting training:", error);
    throw error;
  }
}

export async function startAttendanceApi() {
  try {
    const resp = await fetch(`${HOST}/start_recognition`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error starting attendance:", error);
    throw error;
  }
}

export async function stopAttendanceApi() {
  try {
    const resp = await fetch(`${HOST}/stop_recognition`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error stopping attendance:", error);
    throw error;
  }
}

export async function getRecognizedFaces(dateString) {
  try {
    const resp = await fetch(`${HOST}/recognized_faces?date=${dateString}`);
    const data = await resp.json();
    
    const modified = makePhotoURL(data, 'photo').map(entry => ({
      ...entry,
      status: determineStatus(entry.inTime, entry.outTime)
    }));
    return modified; // [{ name, id, inTime, outTime, photo }, ...]
  } catch (error) {
    console.error("Error fetching recognized faces:", error);
  }
}

export async function getUnrecognizedFaces(dateString) {
  try {
    const resp = await fetch(`${HOST}/unrecognized_faces?date=${dateString}`);
    const data = await resp.json();
    const modified = makePhotoURL(data, 'photo');
    return modified;
  } catch (error) {
    console.error("Error fetching unrecognized faces:", error);
  }
}

export async function startClusterApi(dateString) {
  try {
    const resp = await fetch(`${HOST}/cluster?date=${dateString}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error starting cluster:", error);
    throw error;
  }
}