import axios from "axios";

// Create an axios instance with the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
};

// Feed services
export const feedService = {
  getFeed: (page = 1, limit = 10) =>
    api.get(`/feed?page=${page}&limit=${limit}`),
  getPost: (id) => api.get(`/feed/${id}`),
  createPost: (postData) => api.post("/feed", postData),
};

// Credits services
export const creditService = {
  getBalance: () => api.get("/credits/balance"),
  getTransactions: () => api.get("/credits/transactions"),
  redeemCredits: (redemptionData) =>
    api.post("/credits/redeem", redemptionData),
};

// Learning paths services
export const learningPathService = {
  getAllPaths: () => api.get("/learning-paths"),
  getPath: (id) => api.get(`/learning-paths/${id}`),
  enrollPath: (pathId) => api.post(`/learning-paths/${pathId}/enroll`),
};

// Admin services
export const adminService = {
  getUsers: () => api.get("/admin/users"),
  getReports: () => api.get("/admin/reports"),
  manageContent: (contentData) => api.post("/admin/content", contentData),
};

export default api;
