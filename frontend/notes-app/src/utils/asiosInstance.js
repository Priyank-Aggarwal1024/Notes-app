import axios from "axios"
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json"
    }
});
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)
// axiosInstance.interceptors.response.use((data) => {
//     console.log(data);
// })
export default axiosInstance