import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const DEMO_ROLES = [
  {
    role: "SYSTEM_ADMIN",
    label: "Admin",
    fullName: "Dr. Arthur Vance",
    email: "admin@stms.edu",
    badge: "System Administrator",
    avatar: "👑",
  },
  {
    role: "TEACHER",
    label: "Teacher",
    fullName: "Prof. Clara Evans",
    email: "c.evans@stms.edu",
    badge: "Science & Biology Dept",
    avatar: "👩‍🏫",
  },
  {
    role: "STUDENT",
    label: "Student",
    fullName: "Alex Rivera",
    email: "a.rivera@student.stms.edu",
    badge: "Class 10-A",
    avatar: "🎓",
  },
  {
    role: "PARENT",
    label: "Parent",
    fullName: "Sarah Rivera",
    email: "s.rivera@parent.stms.edu",
    badge: "Guardian of Alex Rivera (10-A)",
    avatar: "👨‍👩‍👦",
  },
];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("jwt_token") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // By default NOT logged in until sign-in
  });

  const login = (jwtToken, user) => {
    setToken(jwtToken);
    localStorage.setItem("jwt_token", jwtToken);

    // Map user to role object
    const roleKey = (user.role || "").toUpperCase();
    const matched = DEMO_ROLES.find(
      (r) => r.role === roleKey || r.label.toUpperCase() === roleKey
    );

    const userObj = {
      role: matched ? matched.role : roleKey,
      label: matched ? matched.label : roleKey,
      fullName: user.fullName || user.username,
      email: user.email,
      badge: matched ? matched.badge : "Registered User",
      avatar: matched ? matched.avatar : "👤",
    };

    setCurrentUser(userObj);
    localStorage.setItem("current_user", JSON.stringify(userObj));
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("current_user");
    setCurrentUser(null);
  };

  const switchRole = (roleKey) => {
    const selected = DEMO_ROLES.find((r) => r.role === roleKey) || DEMO_ROLES[0];
    setCurrentUser(selected);
    localStorage.setItem("current_user", JSON.stringify(selected));
    if (!token) {
      const demoToken = "demo-jwt-token-" + roleKey.toLowerCase();
      setToken(demoToken);
      localStorage.setItem("jwt_token", demoToken);
    }
  };

  const isAuthenticated = Boolean(token && currentUser);

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isAuthenticated,
        role: currentUser ? currentUser.role : null,
        login,
        logout,
        switchRole,
        roles: DEMO_ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      token: "",
      currentUser: null,
      isAuthenticated: false,
      role: null,
      login: () => {},
      logout: () => {},
      switchRole: () => {},
      roles: DEMO_ROLES,
    };
  }
  return context;
}
