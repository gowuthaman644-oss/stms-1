import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getScheduleById,
  updateSchedule,
} from "../services/scheduleService";

function EditScheduleEntry() {
  const { id } = useParams();
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await getScheduleById(id);

        setFormData({
          className: data.className || "",
          subject: data.subject || "",
          teacherName: data.teacherName || "",
          dayOfWeek: data.dayOfWeek || data.day || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          attendanceNote: data.attendanceNote || data.roomNumber || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load schedule entry");
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [id]);

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
      await updateSchedule(id, formData);
      navigate("/view-schedule");
    } catch (err) {
      setError(err.message || "Failed to update schedule entry");
    } finally {
      setSubmitting(false);
    }
  };

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const notesList = ["Present", "Special Lecture", "Lab Session", "Substitute", "Exam Period"];

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="schedule-container">
      <div className="page-header">
        <div className="header-title-group">
          <h2>Edit Schedule Entry</h2>
          <p className="header-subtitle">
            Update timetable timings, assigned teacher, classroom, or attendance status.
          </p>
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
            {submitting ? "Saving..." : "Update Entry"}
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

export default EditScheduleEntry;