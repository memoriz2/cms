export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
export const API_ENDPOINTS = {
  VIDEOS: `${API_URL}/api/portal/videos`,
  BANNERS: `${API_URL}/api/portal/banners`,
  GREETINGS: `${API_URL}/api/portal/greetings`,
  BANNER_NEWS: `${API_URL}/api/portal/banner-news`,
  UPLOADS: `${API_URL}/api/uploads`,
} as const;
