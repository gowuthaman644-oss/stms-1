import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Flag, Award, Sun, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } from "../services/scheduleService";
import { useAuth } from "../context/AuthContext";

function AcademicCalendarView() {
  const { role } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newEvent, setNewEvent] = useState({
    academicYear: "2026-2027",
    eventName: "",
    eventType: "HOLIDAY",
    startDate: "",
    endDate: "",
    isHoliday: true,
    description: "",
  });

  const loadEvents = async () => {
    try {
      setError("");
      const data = await getCalendarEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load academic calendar events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.eventName.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...newEvent,
        isHoliday: newEvent.eventType === "HOLIDAY",
      };
      await createCalendarEvent(payload);
      setFeedback("Calendar event added and saved to database successfully.");
      setShowAdd(false);
      setNewEvent({
        academicYear: "2026-2027",
        eventName: "",
        eventType: "HOLIDAY",
        startDate: "",
        endDate: "",
        isHoliday: true,
        description: "",
      });
      await loadEvents();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to save calendar event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (typeof window !== "undefined" && typeof window.confirm === "function") {
      const confirmed = window.confirm("Are you sure you want to delete this calendar event?");
      if (confirmed === false) return;
    }

    try {
      setError("");
      await deleteCalendarEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setFeedback("Calendar event deleted from database.");
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to delete calendar event");
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "HOLIDAY":
        return <Sun size={18} color="#d97706" />;
      case "EXAM_PERIOD":
        return <Award size={18} color="#2563eb" />;
      default:
        return <Flag size={18} color="#71856a" />;
    }
  };

  const isAdmin = role === "ADMIN" || role === "SYSTEM_ADMIN";

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
            <CalendarIcon
              size={26}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Academic Calendar & Term Dates
          </h2>
          <p className="header-subtitle">
            Official institutional schedule, exam periods, semester breaks, and national holidays (Persistent).
          </p>
        </div>

        {isAdmin && (
          <div className="header-actions">
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setShowAdd(!showAdd)}
            >
              <Plus size={15} />
              {showAdd ? "Close Form" : "Add Calendar Event"}
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} />
          {feedback}
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "#fef2f2", color: "#991b1b", borderRadius: 8, border: "1px solid #fecaca", marginBottom: 16 }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Add Event Form Modal / Expandable */}
      {showAdd && (
        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sage-border)",
            marginBottom: 28,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
            Create New Academic Calendar Event
          </h3>
          <form onSubmit={handleAddEvent}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Science Fair, Term 1 Finals"
                  value={newEvent.eventName}
                  onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Event Category</label>
                <select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                >
                  <option value="HOLIDAY">☀️ Official Holiday</option>
                  <option value="EXAM_PERIOD">🏆 Examination Period</option>
                  <option value="TERM_START">🚩 Term Start / Orientation</option>
                  <option value="TERM_END">🎓 Term End / Assessments</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Start Date</label>
                <input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>End Date</label>
                <input
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Event Description</label>
              <input
                type="text"
                placeholder="Details regarding schedule suspension or special requirements..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
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
                {submitting ? "Saving to Database..." : "Save to Database"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Timeline */}
      {loading ? (
        <p>Loading persistent calendar events...</p>
      ) : events.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No academic events registered. Click "Add Calendar Event" to create one.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                background: "#ffffff",
                padding: "18px 24px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--sage-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div
                  style={{
                    background: "var(--cream-bg)",
                    padding: 12,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getEventIcon(ev.eventType)}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: "16px", color: "var(--text-dark)" }}>
                      {ev.eventName}
                    </h4>
                    <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
                      {ev.eventType}
                    </span>
                    {ev.isHoliday && (
                      <span className="badge badge-present" style={{ fontSize: "11px" }}>
                        Holiday
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", color: "var(--text-dark)" }}>
                    {ev.description || "Official institutional event."}
                  </p>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                    🗓️ {ev.startDate} &nbsp;$\rightarrow$&nbsp; {ev.endDate}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(ev.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--danger)",
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: 6,
                  }}
                  title="Delete Event"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AcademicCalendarView;
