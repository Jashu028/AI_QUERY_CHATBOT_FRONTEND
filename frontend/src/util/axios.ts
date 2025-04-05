import axios from "axios";

console.log("hello", import.meta.env.VITE_BACKEND_BASE_URL)
// ✅ Create Axios Instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true, // ✅ Ensures HTTP-only cookies are sent
});