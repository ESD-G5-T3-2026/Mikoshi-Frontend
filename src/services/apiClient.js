import axios from "axios";

const baseURL = import.meta.env.VITE_API_GATEWAY_URL;

const apiClient = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;

		if (status === 401 || status === 403) {
			if (window.location.pathname !== "/") {
				window.location.href = "/";
			}
			return Promise.reject(new Error("Unauthorized access. Please log in again."));
		}

		throw error;
	},
);

export default apiClient;
