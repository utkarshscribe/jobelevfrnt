import axios from "axios";

const API_BASE_URL = "https://jobapi.crmpannel.site/auth/v1"; // Replace with your backend URL

export const sendOtp = async (email) => {
  try {
    console.log("Sending OTP to:", `${API_BASE_URL}/sendOtp`);
    const response = await axios.post(`${API_BASE_URL}/sendOtp`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const register = async (email, fullName, mobile) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { email, fullName, mobile });
      return response.data;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verifyOtp`, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};


