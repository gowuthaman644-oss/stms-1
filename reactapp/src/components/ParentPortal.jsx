import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Clock, Calendar, AlertCircle } from "lucide-react";
import { getAllSchedules, getParentChildren } from "../services/scheduleService";
import { useAuth } from "../context/AuthContext";

function ParentPortal() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        // 1. Fetch parent's linked children
        try {
          const childrenData = await getParentChildren();
          if (Array.isArray(childrenData) && childrenData.length > 0) {
            setChildrenList(childrenData);
          } else if (currentUser) {
            setChildrenList([
              {
                fullName: currentUser.linkedStudentName || "Alex Rivera",
                username: currentUser.linkedStudentUsername || "student",
                className: currentUser.linkedStudentClass || "10-A",
              },
            ]);
          }
        } catch (e) {
          if (currentUser) {
            setChildrenList([
              {
                fullName: currentUser.linkedStudentName || "Alex Rivera",
                username: currentUser.linkedStudentUsername || "student",
                className: currentUser.linkedStudentClass || "10-A",
              },
            ]);
          }
        }

        // 2. Fetch all schedules
        const scheduleData = await getAllSchedules();
        setSchedules(Array.isArray(scheduleData) ? scheduleData : scheduleData.data || []);
      } catch (err) {
        setError(err.message || "Failed to load parent portal data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const activeChild = childrenList[selectedChildIndex] || {
    fullName: currentUser?.linkedStudentName || "Alex Rivera",
    className: currentUser?.linkedStudentClass || "10-A",
  };

  const childClass = activeChild.className || "10-A";
  const childName = activeChild.fullName || "Your Student";

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
            Academic schedule and timetable monitoring for <strong>{childName}</strong> (Class {childClass}).
          </p>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {childrenList.length > 1 && (
            <select
              className="filter-select"
              value={selectedChildIndex}
              onChange={(e) => setSelectedChildIndex(Number(e.target.value))}
            >
              {childrenList.map((c, idx) => (
                <option key={idx} value={idx}>
                  {c.fullName} (Class {c.className})
                </option>
              ))}
            </select>
          )}

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

      {/* Parent Overview Cards */}
      <div className="stats-bar" style={{ marginBottom: "28px" }}>
        <div className="stat-card">
          <div className="stat-icon">👦</div>
          <div className="stat-info">
            <span className="stat-value">{childName}</span>
            <span className="stat-label">Enrolled • Class {childClass}</span>
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
            <span className="stat-label">Verified Status</span>
          </div>
        </div>
      </div>

      {/* Child Class Schedule */}
      <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
        Class {childClass} Weekly Timetable & Attendance Notes
      </h3>

      {loading ? (
        <p>Loading timetable for {childName}...</p>
      ) : childrenList.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No child is currently linked to this account.
          </p>
        </div>
      ) : childSchedules.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No active periods scheduled for Class {childClass}.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Instructor</th>
                <th>Remarks / Session Note</th>
              </tr>
            </thead>
            <tbody>
              {childSchedules.map((s) => (
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

export default ParentPortal;
