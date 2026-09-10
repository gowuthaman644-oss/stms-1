import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSchedule } from "../services/scheduleService";

const DEMO_SAMPLES = [
  {
    className: "10-A",
    subject: "Mathematics",
    teacherName: "Priya Krishnan",
    dayOfWeek: "Monday",
    startTime: "08:30",
    endTime: "09:15",
    attendanceNote: "Present",
  },
  {
    className: "10-A",
    subject: "Physics & Science Lab",
    teacherName: "Suresh Kumar",
    dayOfWeek: "Tuesday",
    startTime: "09:15",
    endTime: "10:00",
    attendanceNote: "Lab Session",
  },
  {
    className: "9-B",
    subject: "English Literature",
    teacherName: "Meena Iyer",
    dayOfWeek: "Wednesday",
    startTime: "10:15",
    endTime: "11:00",
    attendanceNote: "Special Lecture",
  },
  {
    className: "8-A",
    subject: "Computer Science",
    teacherName: "Arvind Raj",
    dayOfWeek: "Thursday",
    startTime: "11:00",
    endTime: "11:45",
    attendanceNote: "Lab Session",
  },
  {
    className: "10-B",
    subject: "Chemistry Practical",
    teacherName: "Kavitha Nair",
    dayOfWeek: "Friday",
    startTime: "12:30",
    endTime: "01:15",
    attendanceNote: "Lab Session",
  },
  {
    className: "7-A",
    subject: "Social Science",
    teacherName: "Rajesh Sharma",
    dayOfWeek: "Monday",
    startTime: "01:15",
    endTime: "02:00",
    attendanceNote: "Present",
  },
  {
    className: "6-B",
    subject: "Physical Education",
    teacherName: "Vikram Singh",
    dayOfWeek: "Wednesday",
    startTime: "02:00",
    endTime: "02:45",
    attendanceNote: "Present",
  },
  {
    className: "9-A",
    subject: "Biology & Environment",
    teacherName: "Dr. Clara Evans",
    dayOfWeek: "Tuesday",
    startTime: "10:15",
    endTime: "11:15",
    attendanceNote: "Lab Session",
  },
  {
    className: "8-B",
    subject: "Tamil Language",
    teacherName: "K. Selvam",
    dayOfWeek: "Thursday",
    startTime: "08:30",
    endTime: "09:15",
    attendanceNote: "Present",
  },
  {
    className: "10-A",
    subject: "Mathematics Problem Solving",
    teacherName: "Priya Krishnan",
    dayOfWeek: "Friday",
    startTime: "11:00",
    endTime: "11:45",
    attendanceNote: "Exam Period",
  },
  {
    className: "7-B",
    subject: "Hindi Language & Grammar",
    teacherName: "Sunita Verma",
    dayOfWeek: "Monday",
    startTime: "09:15",
    endTime: "10:00",
    attendanceNote: "Substitute",
  },
  {
    className: "6-A",
    subject: "General Science & Nature",
    teacherName: "Suresh Kumar",
    dayOfWeek: "Wednesday",
    startTime: "11:00",
    endTime: "11:45",
    attendanceNote: "Special Lecture",
  },
];

function AddScheduleEntry() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    className: "",
    subject: "",
    teacherName: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    attendanceNote: "",
  });

  const [demoIndex, setDemoIndex] = useState(0);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleDaySelect = (day) => {
    setFormData((prev) => ({ ...prev, dayOfWeek: day }));
  };

  const handleNoteSelect = (note) => {
    setFormData((prev) => ({ ...prev, attendanceNote: note }));
  };

  const prefillSample = () => {
    const sample = DEMO_SAMPLES[demoIndex % DEMO_SAMPLES.length];
    setFormData(sample);
    setDemoIndex((prev) => prev + 1);
    setError("");
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.className || !formData.className.trim() || !formData.subject || !formData.subject.trim()) {
      setError("Please fill in required fields: Class Name and Subject.");
      return;
    }

    setSubmitting(true);

    try {
      await addSchedule(formData);
      navigate("/view-schedule");
    } catch (err) {
      setError(err.message || "Failed to add schedule entry");
    } finally {
      setSubmitting(false);
    }
  };

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const notesList = ["Present", "Special Lecture", "Lab Session", "Substitute", "Exam Period"];

  return (
    <div className="schedule-container">
      <div className="page-header">
        <div className="header-title-group">
          <h2>Add Schedule Entry</h2>
          <p className="header-subtitle">
            Create a new class timetable period, assign teachers, and record attendance details.
          </p>
        </div>

        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {demoIndex > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--sage-primary)",
                fontWeight: "600",
                background: "var(--sage-subtle)",
                padding: "4px 10px",
                borderRadius: "12px",
                border: "1px solid var(--sage-border)",
              }}
            >
              Demo #{((demoIndex - 1) % DEMO_SAMPLES.length) + 1} of {DEMO_SAMPLES.length} loaded
            </span>
          )}
          <button
            type="button"
            className="quick-demo-btn"
            onClick={prefillSample}
            title="Click repeatedly to cycle through 12 different demo details"
          >
            ✨ Autofill Demo
          </button>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Class Name</label>
          <input
            type="text"
            name="className"
            placeholder="Class Name"
            value={formData.className}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Teacher Name</label>
          <input
            type="text"
            name="teacherName"
            placeholder="Teacher Name"
            value={formData.teacherName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Day of Week</label>
          <input
            type="text"
            name="dayOfWeek"
            placeholder="Day"
            value={formData.dayOfWeek}
            onChange={handleChange}
          />
          <div className="chips-container">
            {daysList.map((day) => (
              <span
                key={day}
                className="chip"
                onClick={() => handleDaySelect(day)}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="text"
            name="startTime"
            placeholder="Start Time"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="text"
            name="endTime"
            placeholder="End Time"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Attendance / Session Note</label>
          <input
            type="text"
            name="attendanceNote"
            placeholder="Attendance Note"
            value={formData.attendanceNote}
            onChange={handleChange}
          />
          <div className="chips-container">
            {notesList.map((note) => (
              <span
                key={note}
                className="chip"
                onClick={() => handleNoteSelect(note)}
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add Entry"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/view-schedule")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddScheduleEntry;