import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Clock, CheckCircle2, UserCheck } from "lucide-react";
import { getAllSchedules } from "../services/scheduleService";

function TeacherPortal() {
  const [schedules, setSchedules] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("All");
  const [loading, setLoading] = useState(true);
  const [attendanceLogged, setAttendanceLogged] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSchedules();
        setSchedules(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Teacher portal fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const teachers = Array.from(new Set(schedules.map((s) => s.teacherName).filter(Boolean)));

  const filtered = schedules.filter(
    (s) => selectedTeacher === "All" || s.teacherName === selectedTeacher
  );

  const handleMarkAttendance = (subject, cls) => {
    setAttendanceLogged(`Attendance recorded for ${subject} (${cls})`);
    setTimeout(() => setAttendanceLogged(""), 3500);
  };

  return (
    <motion.div
      className="schedule-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <div className="header-title-group">
          <h2>
            <GraduationCap
              size={26}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Teacher Portal & Classroom Schedule
          </h2>
          <p className="header-subtitle">
            Personal teaching timetable, student attendance logging, and weekly period allocation.
          </p>
        </div>

        <div className="header-actions">
          <select
            className="filter-select"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="All">All Instructors</option>
            {teachers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {attendanceLogged && (
        <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} />
          {attendanceLogged}
        </div>
      )}

      {/* Stats Bar */}
      <div className="stats-bar" style={{ marginBottom: "28px" }}>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <span className="stat-value">{filtered.length} Periods</span>
            <span className="stat-label">Assigned Weekly Load</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-info">
            <span className="stat-value">
              {new Set(filtered.map((s) => s.className)).size} Classes
            </span>
            <span className="stat-label">Active Cohorts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <span className="stat-value">
              {new Set(filtered.map((s) => s.subject)).size} Subjects
            </span>
            <span className="stat-label">Curriculum Areas</span>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
        Assigned Lecture & Lab Sessions
      </h3>

      {loading ? (
        <p>Loading teacher timetable...</p>
      ) : filtered.length === 0 ? (
        <p>No teaching sessions assigned to this instructor.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#ffffff",
                border: "1px solid var(--sage-border)",
                borderRadius: "var(--radius-md)",
                padding: "20px 22px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge badge-neutral">Class {s.className}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                  {s.dayOfWeek}
                </span>
              </div>

              <strong style={{ fontSize: "18px", color: "var(--text-dark)", margin: "4px 0" }}>
                {s.subject}
              </strong>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "13px", color: "var(--sage-dark)" }}>
                <Clock size={14} />
                <span>{s.startTime} - {s.endTime}</span>
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Instructor: <strong>{s.teacherName}</strong>
              </div>

              <div style={{ fontSize: "12px", marginTop: 4 }}>
                Note: <span className="badge badge-present">{s.attendanceNote || "Regular Lecture"}</span>
              </div>

              <button
                type="button"
                onClick={() => handleMarkAttendance(s.subject, s.className)}
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: "13px",
                  padding: "8px 12px",
                }}
              >
                <UserCheck size={14} />
                Mark Attendance
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default TeacherPortal;
