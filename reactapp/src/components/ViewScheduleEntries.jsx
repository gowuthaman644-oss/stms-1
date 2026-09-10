import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllSchedules,
  deleteSchedule,
} from "../services/scheduleService";

function ViewScheduleEntries() {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'matrix'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  const loadSchedules = async () => {
    try {
      setError("");

      const response = await getAllSchedules();

      const data = Array.isArray(response)
        ? response
        : response.data || [];

      setSchedules(data);
    } catch (err) {
      setError(err.message || "Failed to load schedule entries");
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteSchedule(id);

      setSchedules((previous) =>
        previous.filter((schedule) => schedule.id !== id)
      );
      setFeedback("Schedule entry deleted successfully.");
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to delete schedule entry");
    }
  };

  // Filter schedules based on search and dropdown filters
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const day = (schedule.dayOfWeek || schedule.day || "").toLowerCase();
      const cls = (schedule.className || "").toLowerCase();
      const subject = (schedule.subject || "").toLowerCase();
      const teacher = (schedule.teacherName || "").toLowerCase();
      const note = (schedule.attendanceNote || schedule.roomNumber || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        cls.includes(query) ||
        subject.includes(query) ||
        teacher.includes(query) ||
        day.includes(query) ||
        note.includes(query);

      const matchesDay =
        selectedDay === "all" ||
        day === selectedDay.toLowerCase();

      const matchesClass =
        selectedClass === "all" ||
        cls === selectedClass.toLowerCase();

      return matchesSearch && matchesDay && matchesClass;
    });
  }, [schedules, searchTerm, selectedDay, selectedClass]);

  // Unique classes for filter dropdown
  const uniqueClasses = useMemo(() => {
    const list = schedules
      .map((s) => s.className)
      .filter((c) => Boolean(c && c.trim()));
    return Array.from(new Set(list));
  }, [schedules]);

  // Days list for Matrix view
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Helper for attendance badge class
  const getBadgeClass = (note) => {
    if (!note) return "badge badge-neutral";
    const lower = note.toLowerCase();
    if (lower.includes("present")) return "badge badge-present";
    if (lower.includes("absent")) return "badge badge-absent";
    return "badge badge-neutral";
  };

  // Export to CSV feature
  const exportToCSV = () => {
    if (schedules.length === 0) return;

    const headers = [
      "ID",
      "Class",
      "Subject",
      "Teacher",
      "Day",
      "Start Time",
      "End Time",
      "Attendance Note",
    ];

    const rows = schedules.map((s) => [
      s.id || "",
      `"${(s.className || "").replace(/"/g, '""')}"`,
      `"${(s.subject || "").replace(/"/g, '""')}"`,
      `"${(s.teacherName || "").replace(/"/g, '""')}"`,
      `"${(s.dayOfWeek || s.day || "").replace(/"/g, '""')}"`,
      s.startTime || "",
      s.endTime || "",
      `"${(s.attendanceNote || s.roomNumber || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `timetable_schedule_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="schedule-container">
      <div className="page-header">
        <div className="header-title-group">
          <h2>Schedule Entries</h2>
          <p className="header-subtitle">
            Manage school periods, classes, teacher assignments, and attendance logs.
          </p>
        </div>

        <div className="header-actions">
          <button onClick={() => navigate("/add-schedule")}>
            Add Schedule
          </button>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}
      {feedback && <div className="alert-success">{feedback}</div>}

      {/* Stats Summary Strip */}
      {schedules.length > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <span className="stat-value">{schedules.length}</span>
              <span className="stat-label">Total Sessions</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏫</div>
            <div className="stat-info">
              <span className="stat-value">{uniqueClasses.length}</span>
              <span className="stat-label">Active Classes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👩‍🏫</div>
            <div className="stat-info">
              <span className="stat-value">
                {new Set(schedules.map((s) => s.teacherName).filter(Boolean)).size}
              </span>
              <span className="stat-label">Teachers</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🗓️</div>
            <div className="stat-info">
              <span className="stat-value">
                {new Set(schedules.map((s) => s.dayOfWeek || s.day).filter(Boolean)).size}
              </span>
              <span className="stat-label">Active Days</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar: Search, Filters, View Mode Toggle, Export */}
      {schedules.length > 0 && (
        <div className="controls-bar">
          <div className="search-filters-group">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search class, subject, teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="all">All Days</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            {uniqueClasses.length > 0 && (
              <select
                className="filter-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="view-actions-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              📋 Table View
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === "matrix" ? "active" : ""}`}
              onClick={() => setViewMode("matrix")}
            >
              🗓️ Weekly Grid
            </button>
            <button
              type="button"
              className="export-btn"
              onClick={exportToCSV}
              title="Download schedule as CSV"
            >
              📥 Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Schedule Data Display */}
      {schedules.length === 0 ? (
        <p>No schedule entries found.</p>
      ) : viewMode === "table" ? (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Attendance Note</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td><strong>{schedule.className}</strong></td>
                  <td>{schedule.subject}</td>
                  <td>{schedule.teacherName}</td>
                  <td>{schedule.dayOfWeek || schedule.day}</td>
                  <td>{schedule.startTime}</td>
                  <td>{schedule.endTime}</td>
                  <td>
                    <span className={getBadgeClass(schedule.attendanceNote || schedule.roomNumber)}>
                      {schedule.attendanceNote || schedule.roomNumber || "None"}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/edit-schedule/${schedule.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(schedule.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Weekly Matrix Grid View */
        <div className="weekly-matrix">
          {daysOfWeek.map((day) => {
            const dayEntries = filteredSchedules.filter(
              (s) =>
                (s.dayOfWeek || s.day || "").toLowerCase() === day.toLowerCase()
            );

            return (
              <div key={day} className="matrix-day-column">
                <div className="matrix-day-header">
                  <span>{day.substring(0, 3)}</span>
                  <span className="matrix-count-badge">{dayEntries.length}</span>
                </div>

                <div className="matrix-slots-list">
                  {dayEntries.length === 0 ? (
                    <div className="matrix-empty-slot">No classes</div>
                  ) : (
                    dayEntries.map((schedule) => (
                      <div key={schedule.id} className="matrix-card">
                        <div className="matrix-time">
                          ⏰ {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="matrix-subject">{schedule.subject}</div>
                        <div className="matrix-class">Class {schedule.className}</div>
                        <div className="matrix-teacher">👤 {schedule.teacherName}</div>
                        <div>
                          <span className={getBadgeClass(schedule.attendanceNote || schedule.roomNumber)}>
                            {schedule.attendanceNote || schedule.roomNumber || "Scheduled"}
                          </span>
                        </div>
                        <div className="matrix-actions">
                          <button
                            onClick={() =>
                              navigate(`/edit-schedule/${schedule.id}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ViewScheduleEntries;