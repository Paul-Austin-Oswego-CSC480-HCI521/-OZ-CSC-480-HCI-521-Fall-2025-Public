import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    // const exampleUserId = "12345678-1234-1234-1234-123456789abc";

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        setLoading(false);
        return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    const fetchUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users/${user.user_id}`);
            if (!res.ok) throw new Error("Failed to fetch user");
            
            const data = await res.json();
            
            setUser({
                user_id: data.user_id,
                email: data.email,
                name: data.name,
                role: data.role,
                classes: data.classes || []
            });
        } catch (error) {
            console.error("Error loading user:", error);
            setError("Failed to load user");
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };
    if (!user?.user_id) return;
    fetchUser();
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    } else {
        localStorage.removeItem('user');
    }
  };

  return (<UserContext.Provider value={{ user, setUser, loading, error }}>
    {children}
    </UserContext.Provider>);
};

export const authFetch = async (url, options = {}) => {

    // get token from localstroage 
    const token = localStorage.getItem('jwt_token');
    if (!token) {
    throw new Error('No authentication token found');
    }

    // put token in header
    const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`,};
    const response = await fetch(url, {
    ...options,
    headers,});

    // reomve bad tokens 
    if (response.status === 401) {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');}
    return response;
};

export const useUser = () => useContext(UserContext);
