import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('jwt_token');
        if (!savedUser) {
            setLoading(false);
            return;}

        const fetchUser = async () => {
            try {
                console.log(savedUser);
                const res = await authFetch(`${BASE_URL}/auth/me`);
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
                localStorage.removeItem('jwt_token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [BASE_URL]);


    // send request to join a new class
    const courseSubmit = async (code) => {
        console.log("Submitting join code:", code);
        try {
            const res = await authFetch(
            `${BASE_URL}/class/enrollment/request?join_code=${code}&user_id=${user.user_id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }
            );

            const data = await res.json();

            if (res.status === 201) {
            return { success: true, message: data.message || "Enrollment request submitted successfully!" };
            } 
            if (res.status === 404) {
            return { success: false, message: data.error || "Invalid or expired join code." };
            }
            if (res.status === 409) {
            return { success: false, message: data.error || "You're already registered for this course." };
            }

            return { success: false, message: data.error || "Failed to join class. Please try again." };
        } catch (err) {
            console.error("Error submitting join code:", err);
            return { success: false, message: "Something went wrong. Please try again later." };
        }
    };

    // get the list of classes the user is in
    const getClasses = async () => {
        return authFetch(`${BASE_URL}/users/${user.user_id}/classes`)
            .then(res => res.json())
            .then(async (data) => {
                const classProm = data.class_id.map(async (classId) => {
                    const res = await authFetch(`${BASE_URL}/class/${classId}`);
                    const data = await res.json();
                    return { id: classId, name: data.class[0].class_name };
                });
                const classList = await Promise.all(classProm);
                return classList;
            })
            .catch(err => {
                console.error("Failed to load classes", err);
                return [];
            });
    }

    // get cards details 
    const getCard = async (cardId) => {
        const response = await authFetch(`${BASE_URL}/kudo-card/${cardId}?user_id=${user.user_id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch card ${cardId}`);
        }
        return await response.json();
    };

    // get a users info (name, email, role) from the id
    const getUserInfo = async (userId) => {
        try {
            const response = await authFetch(`${BASE_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user ${userId}`);
            }
            const userData = await response.json();
            return userData.name;
        } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            return "Unknown User";
        }
    };

    return (<UserContext.Provider value={{ user, setUser, loading, error, courseSubmit, getClasses, getCard, getUserInfo}}>
        {children}
    </UserContext.Provider>);
};

// make a fetch request with the jwt token in the header
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
