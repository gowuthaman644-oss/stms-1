import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, Calendar, AlertCircle } from "lucide-react";
import { getAllSchedules, getAttendanceByStudent, getCurrentUserProfile } from "../services/scheduleService";
import { useAuth } from "../context/AuthContext";

function StudentPortal() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(currentUser || null);
  const [schedules, setSchedules] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        // 1. Fetch fresh student profile
        try {
          const userProf = await getCurrentUserProfile();
          if (userProf) setProfile(userProf);
        } catch (e) {
          // fallback to auth context profile
          if (currentUser) setProfile(currentUser);
        }

        // 2. Fetch all schedules
        const scheduleData = await getAllSchedules();
        const scheduleList = Array.isArray(scheduleData) ? scheduleData : scheduleData.data || [];
        setSchedules(scheduleList);

        // 3. Fetch student attendance
        const studentIdOrName = (currentUser && (currentUser.studentId || currentUser.fullName)) || "Alex Rivera";
        try {
          const attData = await getAttendanceByStudent(studentIdOrName);
          if (Array.isArray(attData)) setAttendanceRecords(attData);
        } catch (e) {
          // Non-critical if no records yet
        }
      } catch (err) {
        setError(err.message || "Failed to load student portal data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const studentName = profile?.fullName || currentUser?.fullName || "Student";
  const studentClass = profile?.className || currentUser?.className || "10-A";
  const studentId = profile?.studentId || currentUser?.studentId || "STU-1024";

  // Filter schedule strictly for this student's enrolled cohort
  const mySchedules = schedules.filter(
    (s) => (s.className || "").toLowerCase() === studentClass.toLowerCase()
  );

  const presentCount = attendanceRecords.filter((a) => a.status === "PRESENT").length;
  const attendanceNum = attendanceRecords.length > 0 
    ? (presentCount / attendanceRecords.length) * 100 
    : 100.0;
  const attendanceRate = attendanceNum.toFixed(1) + "%";
  const isBelow75 = attendanceRecords.length > 0 && attendanceNum < 75.0;

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
            <BookOpen
              size={26}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Student Timetable & Academic Portal
          </h2>
          <p className="header-subtitle">
            Welcome back, <strong>{studentName}</strong> (Cohort: Class {studentClass} • ID: {studentId})
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => navigate("/calendar")}
          >
            <Calendar size={15} />
            Academic Calendar
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "#fef2f2", color: "#991b1b", borderRadius: 8, border: "1px solid #fecaca", marginBottom: 16 }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {isBelow75 && (
        <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", color: "#92400e", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
          <span>⚠️ Attendance: {attendanceRate} — Attendance is below 75% minimum academic requirement.</span>
        </div>
      )}

      {/* Student Metrics */}
      <div className="stats-bar" style={{ marginBottom: "28px" }}>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <span className="stat-value">Class {studentClass}</span>
            <span className="stat-label">Enrolled Section</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{mySchedules.length} Sessions</span>
            <span className="stat-label">Weekly Classes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: isBelow75 ? "var(--danger)" : "inherit" }}>{attendanceRate}</span>
            <span className="stat-label">Verified Attendance</span>
          </div>
        </div>
      </div>

      {/* Timetable List */}
      <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
        Weekly Timetable for Class {studentClass}
      </h3>

      {loading ? (
        <p>Loading your class schedule...</p>
      ) : mySchedules.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No schedule entries currently configured for <strong>Class {studentClass}</strong>.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time Window</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Location / Session Note</th>
              </tr>
            </thead>
            <tbody>
              {mySchedules.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.dayOfWeek || s.day}</strong>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "13px" }}>
                      <Clock size={13} />
                      {s.startTime} - {s.endTime}
                    </div>
                  </td>
                  <td>
                    <strong>{s.subject}</strong>
                  </td>
                  <td>{s.teacherName}</td>
                  <td>
                    <span className="badge badge-neutral">
                      {s.attendanceNote || "Standard Lecture"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default StudentPortal;
