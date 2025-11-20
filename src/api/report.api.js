import { createAsyncThunk } from "@reduxjs/toolkit";

// Dummy data
const dummyAgentData = [
  { date: "2025-11-01", agentName: "John Sharma", patientName: "Sita Rai", serviceType: "Consultation", amount: 1200 },
  { date: "2025-11-02", agentName: "Ramesh Thapa", patientName: "Ram Bhandari", serviceType: "Checkup", amount: 1500 },
  { date: "2025-11-03", agentName: "John Sharma", patientName: "Hari Lama", serviceType: "Consultation", amount: 1300 },
];

const dummyDoctorData = [
  { date: "2025-11-01", doctorName: "Dr. Amit Kharel", patientName: "Sita Rai", serviceType: "Consultation", amount: 2000 },
  { date: "2025-11-02", doctorName: "Dr. Sunita Shrestha", patientName: "Ram Bhandari", serviceType: "Checkup", amount: 1800 },
  { date: "2025-11-03", doctorName: "Dr. Amit Kharel", patientName: "Hari Lama", serviceType: "Consultation", amount: 2200 },
];

// Simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAgentReport = createAsyncThunk(
  "report/getAgentReport",
  async (data, { rejectWithValue }) => {
    try {
      await delay(300);
      const fromDate = new Date(data.fromDate);
      const toDate = new Date(data.toDate);
      return dummyAgentData.filter(d => {
        const date = new Date(d.date);
        return date >= fromDate && date <= toDate;
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch agent report");
    }
  }
);

export const getDoctorReport = createAsyncThunk(
  "report/getDoctorReport",
  async (data, { rejectWithValue }) => {
    try {
      await delay(300);
      const fromDate = new Date(data.fromDate);
      const toDate = new Date(data.toDate);
      return dummyDoctorData.filter(d => {
        const date = new Date(d.date);
        return date >= fromDate && date <= toDate;
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch doctor report");
    }
  }
);
