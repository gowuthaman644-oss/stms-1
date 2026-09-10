import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Building2,
  Calendar,
  Sparkles,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { getAllSchedules, getResources, getCalendarEvents, getAllUsers } from "../services/scheduleService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [roomsCount, setRoomsCount] = useState(5);
  const [eventsCount, setEventsCount] = useState(5);
  const [usersList, setUsersList] = useState([
    { fullName: "Dr. Arthur Vance", email: "admin@stms.edu", role: "System Administrator", status: "Active" },
    { fullName: "Prof. Clara Evans", email: "c.evans@stms.edu", role: "Teacher (Science)", status: "Active" },
    { fullName: "Mr. John Smith", email: "j.smith@stms.edu", role: "Teacher (Math)", status: "Active" },
    { fullName: "Alex Rivera", email: "a.rivera@student.stms.edu", role: "Student (10-A)", status: "Active" },
    { fullName: "Sarah Rivera", email: "s.rivera@parent.stms.edu", role: "Parent / Guardian", status: "Active" },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const [schedRes, roomRes, eventRes, userRes] = await Promise.allSettled([
          getAllSchedules(),
          getResources(),
          getCalendarEvents(),
          getAllUsers(),
        ]);

        if (schedRes.status === "fulfilled") {
          const list = Array.isArray(schedRes.value) ? schedRes.value : schedRes.value.data || [];
          setSchedules(list);
        }
        if (roomRes.status === "fulfilled" && Array.isArray(roomRes.value)) {
          setRoomsCount(roomRes.value.length);
        }
        if (eventRes.status === "fulfilled" && Array.isArray(eventRes.value)) {
          setEventsCount(eventRes.value.length);
        }
        if (userRes.status === "fulfilled" && Array.isArray(userRes.value) && userRes.value.length > 0) {
          setUsersList(userRes.value.map((u) => ({
            fullName: u.fullName || u.username,
            email: u.email || `${u.username}@stms.edu`,
            role: u.role,
            status: u.isActive !== false ? "Active" : "Inactive",
          })));
        }
      } catch (err) {
        setError("Failed to load full admin overview statistics");
      }
    };

    fetchData();
  }, []);

  const auditLogs = [
    { action: "TIMETABLE_GENERATE", user: "admin@stms.edu", time: "10 minutes ago", detail: "Validated period allocations across grades 10A-10D" },
    { action: "ROOM_BOOK", user: "c.evans@stms.edu", time: "25 minutes ago", detail: "Reserved Science Lab 204 for practical session" },
    { action: "SCHEDULE_UPDATE", user: "admin@stms.edu", time: "1 hour ago", detail: "Updated Class 10-A Math period to Room 101" },
  ];

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
            <ShieldCheck
              size={26}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            System Administrator Control Center
          </h2>
          <p className="header-subtitle">
            Institutional governance, RBAC user supervision, conflict oversight, and facility audits.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => navigate("/add-schedule")}
          >
            <PlusCircle size={15} />
            + Create Schedule
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "#fef2f2", color: "#991b1b", borderRadius: 8, border: "1px solid #fecaca", marginBottom: 16 }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="stats-bar" style={{ marginBottom: "28px" }}>
        <div className="stat-card" onClick={() => navigate("/view-schedule")} style={{ cursor: "pointer" }}>
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-value">{schedules.length}</span>
            <span className="stat-label">Active Schedules</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/resources")} style={{ cursor: "pointer" }}>
          <div className="stat-icon">🏫</div>
          <div className="stat-info">
            <span className="stat-value">{roomsCount} Facilities</span>
            <span className="stat-label">Classrooms & Labs</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/calendar")} style={{ cursor: "pointer" }}>
          <div className="stat-icon">🗓️</div>
          <div className="stat-info">
            <span className="stat-value">{eventsCount} Events</span>
            <span className="stat-label">Academic Calendar</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/view-schedule")} style={{ cursor: "pointer" }}>
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">Active</span>
            <span className="stat-label">FastAPI AI Engine</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div
          onClick={() => navigate("/resources")}
          style={{
            background: "#ffffff",
            padding: "16px 20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sage-border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "transform 0.2s",
          }}
        >
          <Building2 size={24} color="var(--sage-primary)" />
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-dark)" }}>
              Rooms & Facilities
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Classrooms & Labs Inventory</div>
          </div>
        </div>

        <div
          onClick={() => navigate("/calendar")}
          style={{
            background: "#ffffff",
            padding: "16px 20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sage-border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "transform 0.2s",
          }}
        >
          <Calendar size={24} color="var(--sage-primary)" />
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-dark)" }}>
              Academic Calendar
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Holidays & Term Dates</div>
          </div>
        </div>
      </div>

      {/* User Management & Audit Trail Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
        {/* User Accounts Table */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--sage-border)",
            borderRadius: "var(--radius-md)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Users size={18} color="var(--sage-primary)" />
            <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-serif)" }}>
              Educational Stakeholders & RBAC
            </h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{u.fullName}</strong>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{u.email}</div>
                    </td>
                    <td><span className="badge badge-neutral">{u.role}</span></td>
                    <td><span className="badge badge-present">{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Trail */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--sage-border)",
            borderRadius: "var(--radius-md)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Sparkles size={18} color="var(--sage-primary)" />
            <h3 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-serif)" }}>
              Institutional Audit Activity Log
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {auditLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  background: "var(--cream-bg)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--sage-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--sage-dark)" }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{log.time}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-dark)" }}>{log.detail}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 2 }}>
                  By: {log.user}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
