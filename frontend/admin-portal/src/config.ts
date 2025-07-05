export const API_URL =
  // Production IP (주석처리)
  // process.env.REACT_APP_API_URL || "http://139.150.73.107:8080";
  // Local Development
  process.env.REACT_APP_API_URL || "http://localhost:8080";
export const API_ENDPOINTS = {
  VIDEOS: `${API_URL}/api/portal/videos`,
  BANNERS: `${API_URL}/api/portal/banners`,
  GREETINGS: `${API_URL}/api/portal/greetings`,
  BANNER_NEWS: `${API_URL}/api/portal/banner-news`,
  HISTORIES: `${API_URL}/api/portal/histories`,
  UPLOADS: `${API_URL}/api/uploads`,
} as const;
