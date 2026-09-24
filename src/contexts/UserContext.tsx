
import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
  age?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  allergies?: string;
  bloodType?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, userData?: Partial<User>) => {
    setUser({
      name: userData?.name || "Guest User",
      email: email,
      avatar: userData?.avatar || "/placeholder.svg",
      age: userData?.age,
      emergencyContact: userData?.emergencyContact,
      medicalConditions: userData?.medicalConditions,
      allergies: userData?.allergies,
      bloodType: userData?.bloodType,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
