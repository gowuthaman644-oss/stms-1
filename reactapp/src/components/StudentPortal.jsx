import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { getAllSchedules } from "../services/scheduleService";

function StudentPortal() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSchedules();
        setSchedules(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Student portal fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter for student's class (default to 10-A or first class)
  const studentClass = "10-A";
  const mySchedules = schedules.filter(
    (s) => (s.className || "").toLowerCase() === studentClass.toLowerCase()
  );

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
            Welcome back, <strong>Alex Rivera</strong> (Cohort: Class 10-A)
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => navigate("/calendar")}
          >
            <Calendar size={15} />
            View Holiday Calendar
          </button>
        </div>
      </div>

      {/* Student Metrics */}
      <div className="stats-bar" style={{ marginBottom: "28px" }}>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <span className="stat-value">Class 10-A</span>
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
            <span className="stat-value">98.5%</span>
            <span className="stat-label">Attendance Score</span>
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
            No periods currently scheduled for Class {studentClass}.
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
                <th>Instructor</th>
                <th>Attendance Tag</th>
              </tr>
            </thead>
            <tbody>
              {mySchedules.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.dayOfWeek}</strong></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} color="var(--sage-primary)" />
                      <span>{s.startTime} - {s.endTime}</span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: "600" }}>{s.subject}</span></td>
                  <td>👤 {s.teacherName}</td>
                  <td>
                    <span className="badge badge-present">
                      {s.attendanceNote || "Attended"}
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
