import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const DEMO_ROLES = [
  {
    role: "ADMIN",
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
    badge: "Guardian of Alex Rivera",
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
    return null; // By default unauthenticated
  });

  // Check token validity on startup
  useEffect(() => {
    if (token) {
      // If token is invalid or expired
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Expired token -> auto logout
            logout();
          }
        }
      } catch (e) {
        // Not a standard JWT or malformed
      }
    }
  }, [token]);

  const login = (jwtToken, user) => {
    setToken(jwtToken);
    localStorage.setItem("jwt_token", jwtToken);

    const roleKey = (user.role || "").toUpperCase();
    const matched = DEMO_ROLES.find(
      (r) => r.role === roleKey || r.label.toUpperCase() === roleKey
    );

    const userObj = {
      id: user.id,
      username: user.username,
      role: matched ? matched.role : roleKey,
      label: matched ? matched.label : roleKey,
      fullName: user.fullName || user.username,
      email: user.email || (user.username + "@stms.edu"),
      department: user.department || "General",
      className: user.className || "10-A",
      studentId: user.studentId || "",
      linkedStudentUsername: user.linkedStudentUsername || "student",
      linkedStudentName: user.linkedStudentName || "Alex Rivera",
      linkedStudentClass: user.linkedStudentClass || "10-A",
      badge: matched ? matched.badge : (roleKey + " Portal"),
      avatar: matched ? matched.avatar : "👤",
    };

    setCurrentUser(userObj);
    localStorage.setItem("current_user", JSON.stringify(userObj));
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("current_user");
    sessionStorage.clear();
    setCurrentUser(null);
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
      roles: DEMO_ROLES,
    };
  }
  return context;
}
