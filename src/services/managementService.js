import axios from "axios";

// Base URLs
const VITE_API_BASE_URL_MANAGEMENT = import.meta.env.VITE_API_BASE_URL_MANAGEMENT;

// Protected Axios Instance
const axiosProtected = axios.create({
  baseURL: VITE_API_BASE_URL_MANAGEMENT,
});

// Add Request Interceptor for Authorization
axiosProtected.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Outgoing Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
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

// Response Interceptor for Logging
axiosProtected.interceptors.response.use(
  (response) => {
    console.log("Incoming Response:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
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

// --- Geo Location Management ---
export const fetchGeoLocations = async (parentId) => {
  try {
    const response = await axiosProtected.get(`/locations/by-parent`, {
      params: { parentId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch geo locations:", error.response?.data || error.message);
    throw new Error("Failed to fetch geo locations. Please try again.");
  }
};

export const createGeoLocation = async (location) => {
  try {
    const response = await axiosProtected.post(`/locations`, location);
    return response.data;
  } catch (error) {
    console.error("Failed to create geo location:", error.response?.data || error.message);
    throw new Error("Failed to create geo location. Please try again.");
  }
};

// --- Aggregation Center Management ---
export const fetchAggregationCenters = async () => {
  try {
    const response = await axiosProtected.get(`/aggregation-centers`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch aggregation centers:", error.response?.data || error.message);
    throw new Error("Failed to fetch aggregation centers. Please try again.");
  }
};

export const createAggregationCenter = async (center) => {
  try {
    const response = await axiosProtected.post(`/aggregation-centers`, center);
    return response.data;
  } catch (error) {
    console.error("Failed to create aggregation center:", error.response?.data || error.message);
    throw new Error("Failed to create aggregation center. Please try again.");
  }
};

// --- Product Management ---
export const fetchProducts = async () => {
  try {
    const response = await axiosProtected.get(`/products`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error.response?.data || error.message);
    throw new Error("Failed to fetch products. Please try again.");
  }
};

export const createProduct = async (product, withTraceability = false) => {
  try {
    const response = await axiosProtected.post(`/products?withTraceability=${withTraceability}`, product);
    return response.data;
  } catch (error) {
    console.error("Failed to create product:", error.response?.data || error.message);
    throw new Error("Failed to create product. Please try again.");
  }
};

// --- Product Type Management ---
export const fetchProductTypes = async () => {
  try {
    const response = await axiosProtected.get(`/product-types`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product types:", error.response?.data || error.message);
    throw new Error("Failed to fetch product types. Please try again.");
  }
};

export const createProductType = async (productType) => {
  try {
    const response = await axiosProtected.post(`/product-types`, productType);
    return response.data;
  } catch (error) {
    console.error("Failed to create product type:", error.response?.data || error.message);
    throw new Error("Failed to create product type. Please try again.");
  }
};

// --- Farmer Management ---
export const fetchFarmers = async () => {
  try {
    const response = await axiosProtected.get(`/farmers`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch farmers:", error.response?.data || error.message);
    throw new Error("Failed to fetch farmers. Please try again.");
  }
};

export const createFarmer = async (farmer) => {
  try {
    const response = await axiosProtected.post(`/farmers`, farmer);
    return response.data;
  } catch (error) {
    console.error("Failed to create farmer:", error.response?.data || error.message);
    throw new Error("Failed to create farmer. Please try again.");
  }
};

// --- Smart Contract Management ---
export const fetchSmartContracts = async () => {
  try {
    const response = await axiosProtected.get(`/smart-contracts`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch smart contracts:", error.response?.data || error.message);
    throw new Error("Failed to fetch smart contracts. Please try again.");
  }
};

export const createSmartContract = async (contract) => {
  try {
    const response = await axiosProtected.post(`/smart-contracts`, contract);
    return response.data;
  } catch (error) {
    console.error("Failed to create smart contract:", error.response?.data || error.message);
    throw new Error("Failed to create smart contract. Please try again.");
  }
};

export const updateSmartContractStatus = async (contractId, status) => {
  try {
    const response = await axiosProtected.patch(`/smart-contracts/${contractId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update smart contract status:", error.response?.data || error.message);
    throw new Error("Failed to update smart contract status. Please try again.");
  }
};
