
export const HOST = 'http://10.0.0.126:5000';

function makePhotoURL(data, key) {
  return data.map((item) => ({
    ...item,
    [key]: HOST + "/file" + item[key]
  }));
}

function determineStatus(inTime, outTime) {
  if (!inTime || inTime === outTime) {
    return "Absent";
  }

  const inHour = parseInt(inTime.split(":")[0], 10);
  const inMinute = parseInt(inTime.split(":")[1], 10);

  // Compare with 10:00 AM
  if (inHour > 10 || (inHour === 10 && inMinute > 0)) {
    return "Late";
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
    const resp = await fetch(`/recognized?date=${dateString}`);
    console.log(resp);
    const data = await resp.json();
    
    const modified = makePhotoURL(data, 'photo').map(entry => ({
      ...entry,
      status: determineStatus(entry.in_time, entry.out_time)
    }));
    return modified; // [{ name, id, inTime, outTime, photo }, ...]
  } catch (error) {
    console.error("Error fetching recognized faces:", error);
    return [];
  }
}

export async function getUnrecognizedFaces(dateString) {

}
