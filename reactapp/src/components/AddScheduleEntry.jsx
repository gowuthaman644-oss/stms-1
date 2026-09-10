import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSchedule } from "../services/scheduleService";

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
    setFormData({
      className: "10-A",
      subject: "Science & Biology",
      teacherName: "Dr. Clara Evans",
      dayOfWeek: "Tuesday",
      startTime: "10:15",
      endTime: "11:15",
      attendanceNote: "Laboratory Practical",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await addSchedule(formData);
      navigate("/view-schedule");
    } catch (err) {
      setError(err.message || "Failed to add schedule entry");
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

        <div className="header-actions">
          <button
            type="button"
            className="quick-demo-btn"
            onClick={prefillSample}
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
          <button type="submit">Add Entry</button>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddScheduleEntry;