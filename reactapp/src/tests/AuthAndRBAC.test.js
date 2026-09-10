import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../components/Login";
import AcademicCalendarView from "../components/AcademicCalendarView";
import ResourceManagementView from "../components/ResourceManagementView";
import * as ScheduleService from "../services/scheduleService";
import "@testing-library/jest-dom";

jest.mock("../services/scheduleService");

describe("STMS Authentication, RBAC & Extended Feature Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  // Test 1: Unauthenticated user is redirected to /login with access message
  test("unauthenticated visitor to protected route is redirected to login", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <div>Admin Secret Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Form</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Login Page Form")).toBeInTheDocument();
    expect(screen.queryByText("Admin Secret Dashboard")).not.toBeInTheDocument();
  });

  // Test 2: Renders Login page with role demo presets
  test("renders login form with instant credential buttons", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByRole("heading", { name: /Sign In to STMS/i })).toBeInTheDocument();
    expect(screen.getByText(/👑 Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/👩‍🏫 Teacher/i)).toBeInTheDocument();
    expect(screen.getByText(/🎓 Student/i)).toBeInTheDocument();
    expect(screen.getByText(/👨‍👩‍👦 Parent/i)).toBeInTheDocument();
  });

  // Test 3: Academic Calendar renders persistent events
  test("academic calendar renders events from API", async () => {
    ScheduleService.getCalendarEvents.mockResolvedValue([
      {
        id: 1,
        eventName: "Mid-Term Exams",
        eventType: "EXAM_PERIOD",
        startDate: "2026-10-15",
        endDate: "2026-10-22",
        isHoliday: false,
        description: "Examination session",
      },
    ]);

    render(
      <AuthProvider>
        <MemoryRouter>
          <AcademicCalendarView />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(await screen.findByText("Mid-Term Exams")).toBeInTheDocument();
    expect(screen.getByText("Examination session")).toBeInTheDocument();
  });

  // Test 4: Resource Management renders facilities and allows booking
  test("resource management renders facilities from database", async () => {
    ScheduleService.getResources.mockResolvedValue([
      {
        id: 101,
        roomNumber: "Science Lab 204",
        buildingName: "Science Pavilion",
        capacity: 32,
        roomType: "Laboratory",
        equipment: "Microscopes",
        isAvailable: true,
        maintenanceStatus: "OPERATIONAL",
      },
    ]);

    render(
      <AuthProvider>
        <MemoryRouter>
          <ResourceManagementView />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(await screen.findByText("Science Lab 204")).toBeInTheDocument();
    expect(screen.getByText(/Science Pavilion/i)).toBeInTheDocument();
    expect(screen.getByText(/Available/i)).toBeInTheDocument();
  });

  // Test 5: Role protection prevents student from viewing admin content
  test("student role cannot view admin portal and redirects to /student", () => {
    const studentUser = {
      role: "STUDENT",
      username: "student",
      fullName: "Alex Rivera",
      className: "10-A",
    };
    localStorage.setItem("jwt_token", "fake-jwt-token");
    localStorage.setItem("current_user", JSON.stringify(studentUser));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <div>Admin Panel Restricted</div>
                </ProtectedRoute>
              }
            />
            <Route path="/student" element={<div>Student Home Portal</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Student Home Portal")).toBeInTheDocument();
    expect(screen.queryByText("Admin Panel Restricted")).not.toBeInTheDocument();
  });
});
