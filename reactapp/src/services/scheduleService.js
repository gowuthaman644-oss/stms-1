const API_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://8080-dcaaefbfaebbaeaddebffeecbacfad.premiumproject.examly.io");

const ScheduleService = {

  // GET /api/schedule/all
  getAllSchedules: async () => {
    const response = await fetch(`${API_URL}/api/schedule/all`);

    if (!response.ok) {
      throw new Error("Failed to fetch schedule entries");
    }

    return response.json();
  },

  // GET /api/schedule/{id}
  getScheduleById: async (id) => {
    const response = await fetch(
      `${API_URL}/api/schedule/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch schedule entry");
    }

    return response.json();
  },

  // POST /api/schedule/add
  addSchedule: async (schedule) => {
    const response = await fetch(
      `${API_URL}/api/schedule/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schedule),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add schedule entry");
    }

    return response.json();
  },

  // PUT /api/schedule/{id}
  updateSchedule: async (id, schedule) => {
    const response = await fetch(
      `${API_URL}/api/schedule/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schedule),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update schedule entry");
    }

    return response.json();
  },

  // DELETE /api/schedule/{id}
  deleteSchedule: async (id) => {
    const response = await fetch(
      `${API_URL}/api/schedule/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete schedule entry");
    }

    return true;
  },
};

export default ScheduleService;

// Named exports
export const getSchedules =
  ScheduleService.getAllSchedules;

export const getAllSchedules =
  ScheduleService.getAllSchedules;

export const getScheduleById =
  ScheduleService.getScheduleById;

export const addSchedule =
  ScheduleService.addSchedule;

export const updateSchedule =
  ScheduleService.updateSchedule;

export const deleteSchedule =
  ScheduleService.deleteSchedule;