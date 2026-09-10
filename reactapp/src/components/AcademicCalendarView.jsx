import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Flag, Award, Sun } from "lucide-react";

const INITIAL_EVENTS = [
  {
    id: 1,
    eventName: "Fall Semester Orientation",
    eventType: "TERM_START",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    isHoliday: false,
    description: "Welcome week for all incoming students and teacher briefings.",
  },
  {
    id: 2,
    eventName: "Mid-Term Examination Period",
    eventType: "EXAM_PERIOD",
    startDate: "2026-10-15",
    endDate: "2026-10-22",
    isHoliday: false,
    description: "Special examination timetable active campus-wide.",
  },
  {
    id: 3,
    eventName: "Autumn Break & National Holiday",
    eventType: "HOLIDAY",
    startDate: "2026-11-02",
    endDate: "2026-11-06",
    isHoliday: true,
    description: "School closed. Regular classes suspended.",
  },
  {
    id: 4,
    eventName: "Winter Final Assessments",
    eventType: "EXAM_PERIOD",
    startDate: "2026-12-14",
    endDate: "2026-12-22",
    isHoliday: false,
    description: "Semester end practicals and theory evaluations.",
  },
  {
    id: 5,
    eventName: "Winter Vacation",
    eventType: "HOLIDAY",
    startDate: "2026-12-23",
    endDate: "2027-01-08",
    isHoliday: true,
    description: "Campus winter break. Administrative offices open on reduced hours.",
  },
];

function AcademicCalendarView() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    eventType: "HOLIDAY",
    startDate: "",
    endDate: "",
    isHoliday: true,
    description: "",
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.eventName.trim()) return;

    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newEvent,
      },
    ]);
    setShowAdd(false);
    setNewEvent({
      eventName: "",
      eventType: "HOLIDAY",
      startDate: "",
      endDate: "",
      isHoliday: true,
      description: "",
    });
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
              size={24}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Academic Calendar & Holiday Management
          </h2>
          <p className="header-subtitle">
            School terms, official holidays, examination intervals, and institutional events.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus size={16} />
            {showAdd ? "Close Form" : "Schedule Event"}
          </button>
        </div>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddEvent}
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sage-border)",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
            Add Academic Event or Holiday
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Event / Holiday Name</label>
              <input
                type="text"
                placeholder="e.g. Spring Break"
                value={newEvent.eventName}
                onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="filter-select"
                style={{ width: "100%", height: "42px" }}
                value={newEvent.eventType}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    eventType: e.target.value,
                    isHoliday: e.target.value === "HOLIDAY",
                  })
                }
              >
                <option value="HOLIDAY">Holiday / Break</option>
                <option value="EXAM_PERIOD">Examination Window</option>
                <option value="TERM_START">Term Start / Assembly</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Description</label>
            <input
              type="text"
              placeholder="Event remarks or scheduling notes"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
          <button type="submit" style={{ marginTop: 12 }}>
            Save Academic Event
          </button>
        </form>
      )}

      {/* Events Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {events.map((evt) => (
          <div
            key={evt.id}
            style={{
              background: "#ffffff",
              border: "1px solid var(--sage-border)",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {getEventIcon(evt.eventType)}
                <strong style={{ fontSize: "16px", color: "var(--text-dark)" }}>
                  {evt.eventName}
                </strong>
              </div>
              {evt.isHoliday ? (
                <span className="badge badge-absent">Holiday</span>
              ) : (
                <span className="badge badge-neutral">Academic</span>
              )}
            </div>

            <div style={{ fontSize: "13px", color: "var(--sage-primary)", fontWeight: "600" }}>
              🗓️ {evt.startDate} ➔ {evt.endDate}
            </div>

            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {evt.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default AcademicCalendarView;
