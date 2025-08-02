const users = [];

import axios from "axios";

export const login = async (identifier, password) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/auth/login`,
      { identifier, password },
      { withCredentials: true } // allow cookies (JWT)
    );
    console.log(response.data);
    // Your backend currently returns only token — adjust if user data is needed
    return {
      user: response.data.user, // placeholder, replace with real user data if returned
      token: response.data.token,
    };
  } catch (error) {
    throw error.response?.data?.message || "Invalid credentials";
  }
};

export const signup = (name, email, password) => {
  return new Promise((resolve, reject) => {
    if (users.find((u) => u.email === email)) {
      reject("User with this email already exists");
    } else {
      const newUser = { name, email, password };
      users.push(newUser);
      resolve({
        user: newUser,
        token: "fake-jwt-token",
      });
    }
  });
};
