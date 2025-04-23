
export const HOST = 'http://192.168.0.169:5000';

function makePhotoURL(data, key) {
  return data.map((item) => ({
    ...item,
    [key]: HOST + "/file" + item[key]
  }));
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

}

export async function getUnrecognizedFaces(dateString) {

}

export async function getAttendance(dateString) {

}