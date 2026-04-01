import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Don't auto-redirect if we are already on the login page or attempting to login
			const isLoginPage = window.location.pathname.includes('/login');
			const isLoginRequest = error.config.url.includes('/login');
			
			if (!isLoginPage && !isLoginRequest) {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default api;