import axios from "axios";

const API_BASE_URL_PUBLIC = import.meta.env.VITE_API_BASE_URL_PUBLIC;
const API_BASE_URL_PROTECTED = import.meta.env.VITE_API_BASE_URL_PROTECTED;

// Axios Instance for Public APIs
const axiosPublic = axios.create({
  baseURL: API_BASE_URL_PUBLIC,
});

// Axios Instance for Protected APIs
const axiosProtected = axios.create({
  baseURL: API_BASE_URL_PROTECTED,
});


// request interceptor for Protected APIs
axiosProtected.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Detailed logging for debugging
    console.log("Outgoing Request:", {
      url: config.url,
      method: config.method,
      headers: {
        Authorization: config.headers.Authorization, // Explicitly log Authorization header
        ...config.headers,
      },
      data: config.data || null,
      params: config.params || null,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);


// response interceptor for Protected APIs
axiosProtected.interceptors.response.use(
  (response) => {
    console.log("Incoming Response:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    }); // Log response details
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);


// Login API Call
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL_PUBLIC}/login`, { username, password });
    console.log("Raw API Response:", response); // Debugging log
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    }
    return { success: false, message: response.data.message || "Login failed" };
  } catch (error) {
    console.error("Login API Error:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
};



// Refresh Token API Call
export const refreshToken = async (token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_PUBLIC}/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to refresh the token. Please log in again.");
  }
};

// Logout API Call
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage. Skipping API call.");
      return { success: false, message: "No token available to logout." };
    }

    // Attempt API call for logout
    const response = await axios.post(
      `${API_BASE_URL_PUBLIC}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      // Clear localStorage after successful API call
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("username");
      localStorage.removeItem("permissions");

      return { success: true, message: response.data.message };
    }

    // Handle API failure gracefully
    return { success: false, message: response.data.message || "Logout failed" };
  } catch (error) {
    console.error("Logout error:", error);

    // Always clear localStorage even if the API call fails
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    localStorage.removeItem("permissions");

    return { success: false, message: "Logout request failed. Please try again." };
  }
};


/**
 * Create a new user
 * @param {Object} user - The new user data
 * @returns {Promise<Object>} - API response
 */
export const createUser = async (user) => {
  try {
    const response = await axiosProtected.post("/users", user);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create user. Please try again.");
  }
};

/**
 * Fetch a paginated list of users
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 * @returns {Promise<Object>} - API response
 */
export const fetchUsers = async (page = 0, size = 10) => {
  try {
    const response = await axiosProtected.get(`/users?page=${page}&size=${size}`);
    console.log("API Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error.response?.data?.message || error.message || "Unknown error occurred"
    );    
    throw new Error("Failed to fetch users. Please try again.");
  }
};

/**
 * Fetch a specific user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} - API response
 */
export const fetchUserById = async (id) => {
  try {
    const response = await axiosProtected.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch user details. Please try again.");
  }
};

/**
 * Update an existing user
 * @param {number} id - User ID
 * @param {Object} user - Updated user data
 * @returns {Promise<Object>} - API response
 */
export const updateUser = async (id, user) => {
  try {
    const response = await axiosProtected.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update user. Please try again.");
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const response = await axiosProtected.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error.response?.data || error.message);
    throw new Error("Failed to delete user. Please try again.");
  }
};



// Roles APIs
// Fetch all roles
export const fetchRoles = async () => {
  try {
    const response = await axiosProtected.get("/roles");
    console.log("Fetched Roles:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error.response?.data || error.message);
    throw new Error("Failed to fetch roles. Please try again.");
  }
};

// Create a new role
export const createRole = async (role) => {
  try {
    const response = await axiosProtected.post("/roles", role);
    console.log("Created Role:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create role:", error.response?.data || error.message);
    throw new Error("Failed to create role. Please try again.");
  }
};

// Update an existing role
export const updateRole = async (roleId, updatedRole) => {
  try {
    const response = await axiosProtected.put(`/roles/${roleId}`, updatedRole);
    console.log("Updated Role:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update role:", error.response?.data || error.message);
    throw new Error("Failed to update role. Please try again.");
  }
};

// Delete a role
export const deleteRole = async (roleId) => {
  try {
    const response = await axiosProtected.delete(`/roles/${roleId}`);
    console.log("Deleted Role:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete role:", error.response?.data || error.message);
    throw new Error("Failed to delete role. Please try again.");
  }
};

// Assign roles to a user
export const assignRolesToUser = async (username, roles) => {
  try {
    const response = await axiosProtected.post(`/roles/${username}/assign`, roles);
    console.log("Assigned Roles:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to assign roles:", error.response?.data || error.message);
    throw new Error("Failed to assign roles. Please try again.");
  }
};


// Permissions APIs
export const fetchPermissions = async () => {
  const response = await axiosProtected.get(`/permissions`);
  return response.data;
};

export const createPermission = async (permission) => {
  const response = await axiosProtected.post(`/permissions`, permission);
  return response.data;
};

export const updatePermission = async (id, permission) => {
  const response = await axiosProtected.put(`/permissions/${id}`, permission);
  return response.data;
};

// Centralized API Error Handling
const handleApiError = (error) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
};
