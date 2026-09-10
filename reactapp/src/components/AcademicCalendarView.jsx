import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Pencil,
  X,
} from "lucide-react";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../services/scheduleService";
import { useAuth } from "../context/AuthContext";

const CALENDAR_DEMO_SAMPLES = [
  {
    academicYear: "2026-2027",
    eventName: "Unit Test",
    eventType: "EXAM_PERIOD",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    isHoliday: false,
    description: "First cycle formative assessments across subjects.",
  },
  {
    academicYear: "2026-2027",
    eventName: "Parent-Teacher Meeting",
    eventType: "MEETING",
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    isHoliday: false,
    description: "Discussion on student academic progress and attendance review.",
  },
  {
    academicYear: "2026-2027",
    eventName: "Quarterly Examination",
    eventType: "EXAM_PERIOD",
    startDate: "2026-09-22",
    endDate: "2026-09-30",
    isHoliday: false,
    description: "First term evaluation assessments across grades 6 to 10.",
  },
  {
    academicYear: "2026-2027",
    eventName: "Science Exhibition",
    eventType: "EVENT",
    startDate: "2026-10-16",
    endDate: "2026-10-17",
    isHoliday: false,
    description: "Inter-class science model display, robotics demos, and innovation fair.",
  },
  {
    academicYear: "2026-2027",
    eventName: "Annual Sports Day",
    eventType: "EVENT",
    startDate: "2026-11-20",
    endDate: "2026-11-21",
    isHoliday: false,
    description: "Track and field events, march-past, and inter-house athletic meets.",
  },
  {
    academicYear: "2026-2027",
    eventName: "School Annual Day",
    eventType: "EVENT",
    startDate: "2026-12-18",
    endDate: "2026-12-18",
    isHoliday: false,
    description: "Grand cultural gala, drama, music, and academic prize distributions.",
  },
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthAbbr(dateStr) {
  if (!dateStr) return "CAL";
  const parts = dateStr.split("-");
  if (parts.length >= 2) {
    const idx = parseInt(parts[1], 10) - 1;
    if (idx >= 0 && idx < 12) return MONTH_NAMES[idx].toUpperCase();
  }
  return "CAL";
}

function getDayNumber(dateStr) {
  if (!dateStr) return "--";
  const parts = dateStr.split("-");
  if (parts.length >= 3) {
    return parts[2];
  }
  return "--";
}

function AcademicCalendarView() {
  const { role } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoEventIndex, setDemoEventIndex] = useState(0);

  const [monthFilter, setMonthFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    academicYear: "2026-2027",
    eventName: "",
    eventType: "EXAM_PERIOD",
    startDate: "",
    endDate: "",
    isHoliday: false,
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

  const prefillDemoEvent = () => {
    const sample = CALENDAR_DEMO_SAMPLES[demoEventIndex % CALENDAR_DEMO_SAMPLES.length];
    setFormData(sample);
    setDemoEventIndex((prev) => prev + 1);
    setError("");
  };

  const handleStartAdd = () => {
    setEditingEventId(null);
    setFormData({
      academicYear: "2026-2027",
      eventName: "",
      eventType: "EXAM_PERIOD",
      startDate: "",
      endDate: "",
      isHoliday: false,
      description: "",
    });
    setError("");
    setShowForm(true);
  };

  const handleStartEdit = (ev) => {
    setEditingEventId(ev.id);
    setFormData({
      academicYear: ev.academicYear || "2026-2027",
      eventName: ev.eventName || "",
      eventType: ev.eventType || "EXAM_PERIOD",
      startDate: ev.startDate || "",
      endDate: ev.endDate || "",
      isHoliday: !!ev.isHoliday,
      description: ev.description || "",
    });
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEventId(null);
    setError("");
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.eventName.trim()) {
      setError("Please enter an event title.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (formData.startDate > formData.endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        isHoliday: formData.isHoliday || formData.eventType === "HOLIDAY",
      };

      if (editingEventId) {
        await updateCalendarEvent(editingEventId, payload);
        setFeedback("Event updated successfully.");
      } else {
        await createCalendarEvent(payload);
        setFeedback("Event added successfully.");
      }

      setShowForm(false);
      setEditingEventId(null);
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
      setFeedback("Event deleted successfully.");
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to delete calendar event");
    }
  };

  const isAdmin = role === "ADMIN" || role === "SYSTEM_ADMIN";

  // Chronologically sorted events
  const sortedEvents = [...events].sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));

  // Upcoming events (max 3-5 events)
  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingEvents = sortedEvents
    .filter((e) => (e.endDate || e.startDate) >= todayStr)
    .slice(0, 4);

  // Filtered events for the timeline
  const filteredEvents = sortedEvents.filter((ev) => {
    if (categoryFilter !== "ALL") {
      if (categoryFilter === "HOLIDAY" && !ev.isHoliday && ev.eventType !== "HOLIDAY") return false;
      if (categoryFilter !== "HOLIDAY" && ev.eventType !== categoryFilter) return false;
    }
    if (monthFilter !== "ALL") {
      const startMatch = ev.startDate && ev.startDate.startsWith(monthFilter);
      const endMatch = ev.endDate && ev.endDate.startsWith(monthFilter);
      if (!startMatch && !endMatch) return false;
    }
    return true;
  });

  return (
    <motion.div
      className="schedule-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
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
            Official institutional schedule, examinations, events, and holidays.
          </p>
          <div className="calendar-header-meta" style={{ marginTop: 6 }}>
            <span className="current-term-tag">
              🗓️ Current Month: <strong>September 2026</strong>
            </span>
            <span className="current-term-tag">
              🌿 Academic Year: <strong>2026–2027</strong>
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="header-actions">
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => {
                if (showForm) {
                  handleCancelForm();
                } else {
                  handleStartAdd();
                }
              }}
            >
              {showForm ? <X size={15} /> : <Plus size={15} />}
              {showForm ? "Close Form" : "Add Calendar Event"}
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {feedback && (
        <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
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

      {/* Add / Edit Event Form Modal / Expandable */}
      {showForm && (
        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sage-border)",
            marginBottom: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-serif)" }}>
              {editingEventId ? "Edit Academic Calendar Event" : "Create New Academic Calendar Event"}
            </h3>
            {!editingEventId && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {demoEventIndex > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--sage-primary)",
                      fontWeight: "600",
                      background: "var(--sage-subtle)",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      border: "1px solid var(--sage-border)",
                    }}
                  >
                    Sample #{((demoEventIndex - 1) % CALENDAR_DEMO_SAMPLES.length) + 1} of {CALENDAR_DEMO_SAMPLES.length}
                  </span>
                )}
                <button
                  type="button"
                  className="quick-demo-btn"
                  onClick={prefillDemoEvent}
                  title="Click repeatedly to cycle through 6 realistic school events"
                >
                  ✨ Autofill Demo
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveEvent}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Science Exhibition, Quarterly Examination"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Event Category</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                >
                  <option value="EXAM_PERIOD">🏆 Examination Period</option>
                  <option value="MEETING">👥 Parent-Teacher Meeting</option>
                  <option value="EVENT">🚩 School Event / Celebration</option>
                  <option value="HOLIDAY">☀️ Official Holiday</option>
                  <option value="TERM_START">📌 Term Start / Orientation</option>
                  <option value="TERM_END">🎓 Term End / Assessments</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>Event Description</label>
              <input
                type="text"
                placeholder="Details regarding schedule suspension or special requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
              />
            </div>

            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                id="isHolidayCheck"
                checked={formData.isHoliday}
                onChange={(e) => setFormData({ ...formData, isHoliday: e.target.checked })}
              />
              <label htmlFor="isHolidayCheck" style={{ fontSize: 13, cursor: "pointer", color: "var(--text-dark)" }}>
                Mark as official non-instructional Holiday
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={handleCancelForm}
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
                {submitting ? "Saving..." : (editingEventId ? "Update Event" : "Save Event")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 5: UPCOMING EVENTS (Max 3-5 events, sorted by date) */}
      <div className="upcoming-section">
        <div className="upcoming-header">
          <div className="upcoming-title">
            <span>⚡ Next Upcoming Academic Events</span>
            {upcomingEvents.length > 0 && (
              <span className="upcoming-badge-count">{upcomingEvents.length} upcoming</span>
            )}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Next 3–5 milestones
          </span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="no-upcoming-msg">No upcoming events.</div>
        ) : (
          <div className="upcoming-grid">
            {upcomingEvents.map((ev) => (
              <div key={`upcoming-${ev.id}`} className="upcoming-card">
                <div className="upcoming-date-chip">
                  <span className="upcoming-month">{getMonthAbbr(ev.startDate)}</span>
                  <span className="upcoming-day">{getDayNumber(ev.startDate)}</span>
                </div>
                <div className="upcoming-info">
                  <div className="upcoming-name" title={ev.eventName}>
                    {`⚡ Upcoming: ${ev.eventName}`}
                  </div>
                  <div className="upcoming-sub">
                    <span className="badge badge-neutral" style={{ fontSize: "10px", padding: "1px 6px" }}>
                      {ev.eventType}
                    </span>
                    <span>{ev.startDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 6: FILTER / VIEW CONTROLS */}
      <div className="calendar-controls-bar">
        <div className="calendar-month-pills">
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginRight: 4 }}>
            Filter by Month:
          </span>
          <button
            type="button"
            className={`month-pill-btn ${monthFilter === "ALL" ? "active" : ""}`}
            onClick={() => setMonthFilter("ALL")}
          >
            All Months
          </button>
          <button
            type="button"
            className={`month-pill-btn ${monthFilter === "2026-08" ? "active" : ""}`}
            onClick={() => setMonthFilter("2026-08")}
          >
            Aug 2026
          </button>
          <button
            type="button"
            className={`month-pill-btn ${monthFilter === "2026-09" ? "active" : ""}`}
            onClick={() => setMonthFilter("2026-09")}
          >
            Sep 2026
          </button>
          <button
            type="button"
            className={`month-pill-btn ${monthFilter === "2026-10" ? "active" : ""}`}
            onClick={() => setMonthFilter("2026-10")}
          >
            Oct 2026
          </button>
          <button
            type="button"
            className={`month-pill-btn ${monthFilter === "2026-11" ? "active" : ""}`}
            onClick={() => setMonthFilter("2026-11")}
          >
            Nov 2026
          </button>
          <button
            type="button"
            className={`month-pill-btn ${monthFilter === "2026-12" ? "active" : ""}`}
            onClick={() => setMonthFilter("2026-12")}
          >
            Dec 2026
          </button>
        </div>

        <div>
          <select
            className="category-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Event Categories</option>
            <option value="EXAM_PERIOD">Exams Only</option>
            <option value="MEETING">Meetings Only</option>
            <option value="EVENT">School Events Only</option>
            <option value="HOLIDAY">Holidays Only</option>
          </select>
        </div>
      </div>

      {/* Events Timeline List */}
      {loading ? (
        <p>Loading persistent calendar events...</p>
      ) : filteredEvents.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No academic events registered matching the filter.
          </p>
        </div>
      ) : (
        <div className="calendar-events-list">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="calendar-event-row">
              <div className="event-main-content">
                <div className="event-date-box">
                  <span className="date-box-month">{getMonthAbbr(ev.startDate)}</span>
                  <span className="date-box-day">{getDayNumber(ev.startDate)}</span>
                </div>

                <div className="event-text-block">
                  <div className="event-title-line">
                    <h4 className="event-title-heading" title={ev.eventName}>
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

                  <p className="event-description-text" title={ev.description || "Official institutional event."}>
                    {ev.description || "Official institutional event."}
                  </p>

                  <div className="event-meta-line">
                    <span>
                      🗓️ {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `→ ${ev.endDate}` : ""}
                    </span>
                    {ev.academicYear && (
                      <span style={{ color: "var(--text-muted)" }}>
                        • Term {ev.academicYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="event-actions-group">
                  <button
                    type="button"
                    className="btn-icon-edit"
                    onClick={() => handleStartEdit(ev)}
                    title="Edit Event"
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-icon-delete"
                    onClick={() => handleDeleteEvent(ev.id)}
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AcademicCalendarView;

