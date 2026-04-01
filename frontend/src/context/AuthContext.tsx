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
	const user = {
		id: 'guest',
		name: 'Guest User',
		email: 'guest@atsense.local'
	};
	const token = 'dummy-token';

	const login = () => {};
	const logout = () => {};

	const isAuthenticated = true;

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