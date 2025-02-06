import axios from "axios";

const API_BASE_URL = "https://your-backend.com/api"; // Replace with your backend URL

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};


