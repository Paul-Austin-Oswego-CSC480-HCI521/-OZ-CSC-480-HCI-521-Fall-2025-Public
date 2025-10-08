import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const exampleUserId = "12345678-1234-1234-1234-123456789abc";

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/kudo-app/api/users/${exampleUserId}`);
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
        } finally {
            setLoading(false);
        }
    }
      fetchUser();
  }, [BASE_URL]);

  return <UserContext.Provider value={{ user, setUser, loading, error }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
