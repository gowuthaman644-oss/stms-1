import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Clock, Calendar } from "lucide-react";
import { getAllSchedules } from "../services/scheduleService";

function ParentPortal() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSchedules();
        setSchedules(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Parent portal fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const childClass = "10-A";
  const childSchedules = schedules.filter(
    (s) => (s.className || "").toLowerCase() === childClass.toLowerCase()
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
            <Users
              size={26}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Parent / Guardian Schedule Portal
          </h2>
          <p className="header-subtitle">
            Academic schedule monitoring for <strong>Alex Rivera</strong> (Class 10-A)
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

      {/* Parent Overview Cards */}
      <div className="stats-bar" style={{ marginBottom: "28px" }}>
        <div className="stat-card">
          <div className="stat-icon">👦</div>
          <div className="stat-info">
            <span className="stat-value">Alex Rivera</span>
            <span className="stat-label">Student • Class 10-A</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-value">{childSchedules.length} Sessions</span>
            <span className="stat-label">Weekly Curriculum</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">Good Standing</span>
            <span className="stat-label">Attendance Status</span>
          </div>
        </div>
      </div>

      {/* Child Class Schedule */}
      <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
        Class 10-A Weekly Timetable & Attendance Notes
      </h3>

      {loading ? (
        <p>Loading schedule...</p>
      ) : childSchedules.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No sessions currently registered for Class 10-A.
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
                <th>Assigned Teacher</th>
                <th>Teacher Note / Attendance</th>
              </tr>
            </thead>
            <tbody>
              {childSchedules.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.dayOfWeek}</strong></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} color="var(--sage-primary)" />
                      <span>{s.startTime} - {s.endTime}</span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: "600" }}>{s.subject}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span>👤 {s.teacherName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-present">
                      {s.attendanceNote || "Regular Attendance"}
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

export default ParentPortal;
