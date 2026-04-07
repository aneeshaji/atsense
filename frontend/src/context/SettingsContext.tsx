import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface Settings {
    google_analytics_id?: string;
    google_search_console_tag?: string;
    seo_indexing?: string;
    maintenance_mode?: string;
    [key: string]: any;
}

interface SettingsContextType {
    settings: Settings;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({});
    const [loading, setLoading] = useState(true);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (fetched) return;

        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
                setFetched(true);
            } catch (err) {
                console.error("Failed to fetch global settings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [fetched]);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
