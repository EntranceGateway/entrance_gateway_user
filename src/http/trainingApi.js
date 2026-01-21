// http/trainingApi.js
import api from "./index"; // your Axios instance
import { v4 as uuidv4 } from 'uuid';

// Get all trainings with pagination & sorting
export const getTrainings = async (page = 0, size = 10, sortDir = "asc") => {
  const response = await api.get(
    `/trainings?page=${page}&size=${size}&sortBy=trainingStatus&sortDir=${sortDir}`
  );
  return response.data.data.content;
};

// Get training by ID
export const getTrainingById = async (id) => {
  const response = await api.get(`/trainings/${id}`);
  return response.data;
};

// Enroll in a training – now with Idempotency-Key
export const enrollTraining = async (trainingId, formData) => {
  const idempotencyKey = uuidv4(); // Generate a fresh UUID for each submission attempt

  try {
    const response = await api.post(
      `/training-enrollments/${trainingId}/enroll`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // still needed, Axios sets boundary automatically
          "Idempotency-Key": idempotencyKey,     // ← this fixes the 500 error
        },
      }
    );
    return response.data; // { message, data }
  } catch (error) {
    console.error("Enrollment API error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};