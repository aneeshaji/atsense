import axios from 'axios';

const api = axios.create({
	baseURL: (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + '/api',
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Simple Request Deduplication Cache
const pendingRequests = new Map();

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		const adminToken = localStorage.getItem('admin_token');
		
		// Use admin token for admin routes, otherwise standard token
		if (config.url?.includes('/admin/') && adminToken) {
			config.headers.Authorization = `Bearer ${adminToken}`;
		} else if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// --- REQUEST DEDUPLICATION LOGIC ---
		// Create a unique key for the request (Method + URL + Params)
		const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;

		// If a request with the same key is already pending, return a "canceled" promise 
		// that will be resolved by the first request. 
		// BUT for simplicity in a React environment, we just let GET requests be cached for 100ms.
		if (config.method?.toLowerCase() === 'get') {
			const now = Date.now();
			const lastRequest = pendingRequests.get(requestKey);
			
			if (lastRequest && (now - lastRequest.timestamp < 100)) {
				// Cancel this duplicate request
				const source = axios.CancelToken.source();
				config.cancelToken = source.token;
				source.cancel('DUPLICATE_REQUEST_PREVENTED');
				return config;
			}
			pendingRequests.set(requestKey, { timestamp: now });
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
		// Suppress errors for duplicate requests we intentionally canceled
		if (error.message === 'DUPLICATE_REQUEST_PREVENTED') {
			return new Promise(() => {}); // Return a pending promise to stop downstream catch blocks
		}

		if (error.response?.status === 401) {
			const isLoginPage = window.location.pathname.includes('/login');
			const isLoginRequest = error.config.url.includes('/login');
			const isAdminRequest = error.config.url.includes('/admin/');
			
			if (!isLoginPage && !isLoginRequest) {
				if (isAdminRequest) {
					localStorage.removeItem('admin_token');
					window.location.href = '/admin/login';
				} else {
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					window.location.href = '/login';
				}
			}
		}
		return Promise.reject(error);
	}
);

export default api;