export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
export const API_ENDPOINTS = {
    VIDEOS: `${API_URL}/api/portal/videos`,
} as const;
