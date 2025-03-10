import axios from "axios";




// ✅ Create Axios Instance
export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // ✅ Ensures HTTP-only cookies are sent
});