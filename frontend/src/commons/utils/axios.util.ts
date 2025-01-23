import axios from "axios";
import { getToken, isLoggedIn } from "../services/auth.service";

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {

        if (isLoggedIn()) {
            // Retrieve the token dynamically
            const token = getToken(); // Replace with your token retrieval logic
            if (token) {
                config.headers['Authorization'] = `Token ${token}`;
            }
        }
        return config;
    },
    (error) => {
        // Handle errors
        return Promise.reject(error);
    }
);