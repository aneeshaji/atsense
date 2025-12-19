import { createContext, useState, useContext, ReactNode } from 'react';

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthContextType {
	token: string | null;
	user: User | null;
	login: (token: string, user: User) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext < AuthContextType | undefined > (undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState < string | null > (
		localStorage.getItem('token')
	);
	const [user, setUser] = useState < User | null > (() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const login = (jwt: string, userData: User) => {
		localStorage.setItem('token', jwt);
		localStorage.setItem('user', JSON.stringify(userData));
		setToken(jwt);
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
	};

	const isAuthenticated = !!token;

	return (
		<AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};