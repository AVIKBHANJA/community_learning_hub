import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

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
          // Get the user profile from the API
          const response = await authService.getCurrentUser();

          if (response.data.success) {
            setCurrentUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("token");
        }
      }

      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });

      if (response.data.success) {
        // Store the token
        localStorage.setItem("token", response.data.token);

        // Get user profile
        const userResponse = await authService.getCurrentUser();

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
      const response = await authService.register({
        username: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (response.data.success) {
        // Store the token
        localStorage.setItem("token", response.data.token);

        // Get user profile
        const userResponse = await authService.getCurrentUser();

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
