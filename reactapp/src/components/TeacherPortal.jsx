import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Clock, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { getAllSchedules, markAttendance } from "../services/scheduleService";
import { useAuth } from "../context/AuthContext";

function TeacherPortal() {
  const { currentUser } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceFeedback, setAttendanceFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Attendance marking modal state
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({
    status: "PRESENT",
    studentName: "Alex Rivera",
    remarks: "Attended full lecture and participated in discussion.",
  });

  const loadData = async () => {
    try {
      setError("");
      const data = await getAllSchedules();
      const list = Array.isArray(data) ? data : data.data || [];
      setSchedules(list);

      // Default selected teacher to current teacher if logged in as teacher
      if (currentUser && currentUser.role === "TEACHER" && currentUser.fullName) {
        const found = list.find((s) => s.teacherName === currentUser.fullName);
        if (found) {
          setSelectedTeacher(currentUser.fullName);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load teacher schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const teachers = Array.from(new Set(schedules.map((s) => s.teacherName).filter(Boolean)));

  const filtered = schedules.filter(
    (s) => selectedTeacher === "All" || s.teacherName === selectedTeacher
  );

  const openAttendanceModal = (session) => {
    setActiveSession(session);
    setAttendanceForm({
      status: "PRESENT",
      studentName: "Alex Rivera",
      remarks: `Class ${session.className} ${session.subject} session attendance.`,
    });
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!activeSession) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        className: activeSession.className,
        subject: activeSession.subject,
        teacherName: activeSession.teacherName || (currentUser ? currentUser.fullName : "Prof. Clara Evans"),
        studentName: attendanceForm.studentName,
        studentId: "STU1024",
        date: new Date().toISOString().split("T")[0],
        status: attendanceForm.status,
        remarks: attendanceForm.remarks,
      };

      await markAttendance(payload);
      setAttendanceFeedback(`Attendance successfully persisted for ${activeSession.subject} (Class ${activeSession.className}).`);
      setActiveSession(null);
      setTimeout(() => setAttendanceFeedback(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to persist attendance record");
    } finally {
      setSubmitting(false);
    }
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
            Personal teaching timetable, student attendance logging, and weekly period allocation for{" "}
            <strong>{currentUser ? currentUser.fullName : "Faculty"}</strong>.
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

      {attendanceFeedback && (
        <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} />
          {attendanceFeedback}
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "#fef2f2", color: "#991b1b", borderRadius: 8, border: "1px solid #fecaca", marginBottom: 16 }}>
          <AlertCircle size={16} />
          {error}
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
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">Active</span>
            <span className="stat-label">Verified Faculty</span>
          </div>
        </div>
      </div>

      {/* Timetable Table */}
      <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
        Weekly Teaching Schedule ({selectedTeacher})
      </h3>

      {loading ? (
        <p>Loading assigned teaching periods...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No teaching sessions assigned under <strong>{selectedTeacher}</strong>.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time Window</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Facility / Room</th>
                <th>Attendance Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
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
                    <span className="badge badge-neutral">Class {s.className}</span>
                  </td>
                  <td><strong>{s.subject}</strong></td>
                  <td>{s.attendanceNote || "Room 101"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-action-primary"
                      onClick={() => openAttendanceModal(s)}
                      style={{
                        padding: "5px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "6px",
                        background: "var(--sage-primary)",
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <UserCheck size={13} />
                      Mark Attendance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Attendance Persistence Modal */}
      {activeSession && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              border: "1px solid var(--sage-border)",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-serif)" }}>
              Mark Attendance • Class {activeSession.className}
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "var(--text-muted)" }}>
              Subject: <strong>{activeSession.subject}</strong> | Time: {activeSession.startTime} - {activeSession.endTime}
            </p>

            <form onSubmit={handleSaveAttendance}>
              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                  Student Name
                </label>
                <input
                  type="text"
                  value={attendanceForm.studentName}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, studentName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                  Attendance Status
                </label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                >
                  <option value="PRESENT">✅ Present</option>
                  <option value="ABSENT">❌ Absent</option>
                  <option value="LATE">⏰ Late</option>
                  <option value="EXCUSED">📝 Excused Absence</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                  Remarks / Session Notes
                </label>
                <input
                  type="text"
                  value={attendanceForm.remarks}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setActiveSession(null)}
                  style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--sage-border)", background: "#ffffff", cursor: "pointer" }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    background: "var(--sage-primary)",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Saving to Database..." : "Save Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default TeacherPortal;
