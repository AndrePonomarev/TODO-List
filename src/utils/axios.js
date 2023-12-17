import axios from "axios";

const api = axios.create({
    baseURL: 'http://a430f081804b.vps.myjino.ru/api/v1',
    withCredentials: false,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers['X-BASE-AUTH'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;