import React, { createContext, useContext, useState} from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: 1,
        name: "Alice",
        role: "student",
    });

    return (
        <UserContext.Provider value = {{ user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);