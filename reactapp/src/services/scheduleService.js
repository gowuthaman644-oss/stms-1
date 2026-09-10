export const API_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://8080-dcaaefbfaebbaeaddebffeecbacfad.premiumproject.examly.io");

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response, defaultError) => {
  if (!response.ok) {
    let errorMsg = defaultError;
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorMsg = errJson.message;
      }
    } catch (e) {
      // Non-JSON response
    }
    if (response.status === 401) {
      errorMsg = "Your session has expired or is invalid. Please sign in again.";
    } else if (response.status === 403) {
      errorMsg = "You do not have permission to perform this action.";
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

const ScheduleService = {
  // === SCHEDULE CRUD ===
  getAllSchedules: async () => {
    const response = await fetch(`${API_URL}/api/schedule/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to fetch schedule entries");
  },

  getScheduleById: async (id) => {
    const response = await fetch(`${API_URL}/api/schedule/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to fetch schedule entry");
  },

  addSchedule: async (schedule) => {
    const response = await fetch(`${API_URL}/api/schedule/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(schedule),
    });
    return handleResponse(response, "Failed to add schedule entry");
  },

  updateSchedule: async (id, schedule) => {
    const response = await fetch(`${API_URL}/api/schedule/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(schedule),
    });
    return handleResponse(response, "Failed to update schedule entry");
  },

  deleteSchedule: async (id) => {
    const response = await fetch(`${API_URL}/api/schedule/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      let errorMsg = "Failed to delete schedule entry";
      try {
        const errJson = await response.json();
        if (errJson && errJson.message) errorMsg = errJson.message;
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return true;
  },

  // === ATTENDANCE PERSISTENCE ===
  getAllAttendance: async () => {
    const response = await fetch(`${API_URL}/api/attendance`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load attendance records");
  },

  getAttendanceByClass: async (className) => {
    const response = await fetch(`${API_URL}/api/attendance/class/${encodeURIComponent(className)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load class attendance");
  },

  getAttendanceByStudent: async (studentId) => {
    const response = await fetch(`${API_URL}/api/attendance/student/${encodeURIComponent(studentId)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load student attendance");
  },

  markAttendance: async (attendanceRecord) => {
    const response = await fetch(`${API_URL}/api/attendance/mark`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(attendanceRecord),
    });
    return handleResponse(response, "Failed to record attendance");
  },

  // === ACADEMIC CALENDAR PERSISTENCE ===
  getCalendarEvents: async () => {
    const response = await fetch(`${API_URL}/api/calendar`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load academic calendar events");
  },

  createCalendarEvent: async (event) => {
    const response = await fetch(`${API_URL}/api/calendar`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(event),
    });
    return handleResponse(response, "Failed to create calendar event");
  },

  updateCalendarEvent: async (id, event) => {
    const response = await fetch(`${API_URL}/api/calendar/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(event),
    });
    return handleResponse(response, "Failed to update calendar event");
  },

  deleteCalendarEvent: async (id) => {
    const response = await fetch(`${API_URL}/api/calendar/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete calendar event");
    return true;
  },

  // === RESOURCE / ROOM PERSISTENCE ===
  getResources: async () => {
    const response = await fetch(`${API_URL}/api/resources`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load facility resources");
  },

  createResource: async (room) => {
    const response = await fetch(`${API_URL}/api/resources`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(room),
    });
    return handleResponse(response, "Failed to create facility");
  },

  bookResource: async (id) => {
    const response = await fetch(`${API_URL}/api/resources/${id}/book`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to book facility");
  },

  releaseResource: async (id) => {
    const response = await fetch(`${API_URL}/api/resources/${id}/release`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to release facility");
  },

  deleteResource: async (id) => {
    const response = await fetch(`${API_URL}/api/resources/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete facility");
    return true;
  },

  // === USER / PROFILE DATA ===
  getCurrentUserProfile: async () => {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load user profile");
  },

  getAllStudents: async () => {
    const response = await fetch(`${API_URL}/api/users/students`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load students");
  },

  getParentChildren: async () => {
    const response = await fetch(`${API_URL}/api/users/parent/children`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load linked children");
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/api/users/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response, "Failed to load user directory");
  },
};

export default ScheduleService;

// Named exports
export const getSchedules = ScheduleService.getAllSchedules;
export const getAllSchedules = ScheduleService.getAllSchedules;
export const getScheduleById = ScheduleService.getScheduleById;
export const addSchedule = ScheduleService.addSchedule;
export const updateSchedule = ScheduleService.updateSchedule;
export const deleteSchedule = ScheduleService.deleteSchedule;

export const getAllAttendance = ScheduleService.getAllAttendance;
export const getAttendanceByClass = ScheduleService.getAttendanceByClass;
export const getAttendanceByStudent = ScheduleService.getAttendanceByStudent;
export const markAttendance = ScheduleService.markAttendance;

export const getCalendarEvents = ScheduleService.getCalendarEvents;
export const createCalendarEvent = ScheduleService.createCalendarEvent;
export const updateCalendarEvent = ScheduleService.updateCalendarEvent;
export const deleteCalendarEvent = ScheduleService.deleteCalendarEvent;

export const getResources = ScheduleService.getResources;
export const createResource = ScheduleService.createResource;
export const bookResource = ScheduleService.bookResource;
export const releaseResource = ScheduleService.releaseResource;
export const deleteResource = ScheduleService.deleteResource;

export const getCurrentUserProfile = ScheduleService.getCurrentUserProfile;
export const getAllStudents = ScheduleService.getAllStudents;
export const getParentChildren = ScheduleService.getParentChildren;
export const getAllUsers = ScheduleService.getAllUsers;