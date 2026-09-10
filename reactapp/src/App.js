import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import AddScheduleEntry from "./components/AddScheduleEntry";
import EditScheduleEntry from "./components/EditScheduleEntry";
import ViewScheduleEntries from "./components/ViewScheduleEntries";
import AdminDashboard from "./components/AdminDashboard";
import TeacherPortal from "./components/TeacherPortal";
import StudentPortal from "./components/StudentPortal";
import ParentPortal from "./components/ParentPortal";
import ResourceManagementView from "./components/ResourceManagementView";
import AcademicCalendarView from "./components/AcademicCalendarView";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Schedule Management Routes */}
              <Route
                path="/add-schedule"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "SYSTEM_ADMIN", "TEACHER"]}>
                    <AddScheduleEntry />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "SYSTEM_ADMIN", "TEACHER"]}>
                    <EditScheduleEntry />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-schedule/:id"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "SYSTEM_ADMIN", "TEACHER"]}>
                    <EditScheduleEntry />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/view-schedule"
                element={
                  <ProtectedRoute>
                    <ViewScheduleEntries />
                  </ProtectedRoute>
                }
              />

              {/* Protected Role-Based Dashboards */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "SYSTEM_ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={["TEACHER", "ADMIN", "SYSTEM_ADMIN"]}>
                    <TeacherPortal />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "ADMIN", "SYSTEM_ADMIN"]}>
                    <StudentPortal />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/parent"
                element={
                  <ProtectedRoute allowedRoles={["PARENT", "ADMIN", "SYSTEM_ADMIN"]}>
                    <ParentPortal />
                  </ProtectedRoute>
                }
              />

              {/* Protected Facilities and Calendar */}
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <ResourceManagementView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <AcademicCalendarView />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;