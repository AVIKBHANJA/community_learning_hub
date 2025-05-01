import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create API base URL
const API_URL = "http://localhost:5000/api";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Set the auth token in axios defaults
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Get the user profile from the API
          const response = await axios.get(`${API_URL}/auth/me`);

          if (response.data.success) {
            setCurrentUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }

      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Store the token
        localStorage.setItem("token", response.data.token);

        // Set the auth token in axios defaults
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        // Get user profile
        const userResponse = await axios.get(`${API_URL}/auth/me`);

        setCurrentUser(userResponse.data.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (response.data.success) {
        // Store the token
        localStorage.setItem("token", response.data.token);

        // Set the auth token in axios defaults
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        // Get user profile
        const userResponse = await axios.get(`${API_URL}/auth/me`);

        setCurrentUser(userResponse.data.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
