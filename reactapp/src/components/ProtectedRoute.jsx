import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to /login
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: "Please sign in with your credentials to access this page.",
        }}
        replace
      />
    );
  }

  // If specific roles are required, check permission
  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = (currentUser.role || "").toUpperCase();
    const hasRole = allowedRoles.some((r) => {
      const target = r.toUpperCase();
      if ((target === "ADMIN" || target === "SYSTEM_ADMIN") && (currentRole === "ADMIN" || currentRole === "SYSTEM_ADMIN")) {
        return true;
      }
      return target === currentRole;
    });

    if (!hasRole) {
      // Not authorized for this specific portal, send to their own portal
      if (currentRole === "TEACHER") return <Navigate to="/teacher" replace />;
      if (currentRole === "STUDENT") return <Navigate to="/student" replace />;
      if (currentRole === "PARENT") return <Navigate to="/parent" replace />;
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
