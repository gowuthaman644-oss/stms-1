import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, XCircle, Plus, Wrench, Trash2, AlertCircle } from "lucide-react";
import { getResources, createResource, bookResource, releaseResource, deleteResource } from "../services/scheduleService";
import { useAuth } from "../context/AuthContext";

const RESOURCE_DEMO_SAMPLES = [
  {
    roomNumber: "Room 203 - Smart Class",
    buildingName: "Main Academic Block",
    capacity: 40,
    roomType: "Classroom",
    equipment: "Interactive Smartboard, Dual Speakers, High-Speed Wi-Fi",
  },
  {
    roomNumber: "Science Lab 204",
    buildingName: "Science & Discovery Wing",
    capacity: 45,
    roomType: "Laboratory",
    equipment: "Compound microscopes, Bunsen burners, chemical fume hoods",
  },
  {
    roomNumber: "Computer Lab 302",
    buildingName: "Technology Block",
    capacity: 50,
    roomType: "Computer Lab",
    equipment: "40 High-performance PCs, gigabit LAN, laser printer",
  },
  {
    roomNumber: "Seminar Hall B",
    buildingName: "Administrative Wing",
    capacity: 120,
    roomType: "Auditorium",
    equipment: "Podium mic, surround sound system, motorized laser projector",
  },
  {
    roomNumber: "Mathematics Lab 106",
    buildingName: "Main Academic Block",
    capacity: 35,
    roomType: "Classroom",
    equipment: "Geometric kits, 3D math models, interactive graphing display",
  },
  {
    roomNumber: "Language Lab 108",
    buildingName: "Humanities Wing",
    capacity: 38,
    roomType: "Classroom",
    equipment: "Student audio headsets, digital phonetics software station",
  },
];

function ResourceManagementView() {
  const { role } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [demoRoomIndex, setDemoRoomIndex] = useState(0);

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    buildingName: "Main Academic Block",
    capacity: 30,
    roomType: "Classroom",
    equipment: "Smartboard, 4K Projector",
  });

  const prefillDemoRoom = () => {
    const sample = RESOURCE_DEMO_SAMPLES[demoRoomIndex % RESOURCE_DEMO_SAMPLES.length];
    setNewRoom(sample);
    setDemoRoomIndex((prev) => prev + 1);
    setError("");
  };

  const loadRooms = async () => {
    try {
      setError("");
      const data = await getResources();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load facility resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleToggleBooking = async (room) => {
    setError("");
    const available = room.isAvailable !== undefined ? room.isAvailable : room.available;
    try {
      if (available) {
        await bookResource(room.id);
        setFeedback("Room booked successfully.");
      } else {
        await releaseResource(room.id);
        setFeedback("Room released and marked available.");
      }
      await loadRooms();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("occupied") || msg.toLowerCase().includes("conflict") || msg.toLowerCase().includes("already")) {
        setError("Room is already booked for this time.");
      } else {
        setError(msg || "Failed to update room booking status");
      }
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await createResource({
        ...newRoom,
        capacity: Number(newRoom.capacity),
        isAvailable: true,
        maintenanceStatus: "OPERATIONAL",
      });
      setFeedback(`Facility ${newRoom.roomNumber} successfully added to database.`);
      setShowAddModal(false);
      setNewRoom({
        roomNumber: "",
        buildingName: "Main Academic Block",
        capacity: 30,
        roomType: "Classroom",
        equipment: "Smartboard, 4K Projector",
      });
      await loadRooms();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to create facility resource");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id, roomNumber) => {
    if (typeof window !== "undefined" && typeof window.confirm === "function") {
      const confirmed = window.confirm(`Are you sure you want to delete ${roomNumber}?`);
      if (confirmed === false) return;
    }

    try {
      setError("");
      await deleteResource(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      setFeedback(`Facility ${roomNumber} deleted successfully.`);
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(err.message || "Failed to delete facility");
    }
  };

  const isAdmin = role === "ADMIN" || role === "SYSTEM_ADMIN";
  const isStaff = isAdmin || role === "TEACHER";

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
            <Building2
              size={26}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Classroom & Resource Management
          </h2>
          <p className="header-subtitle">
            Facility allocation, smart lab inventory, equipment tracking, and real-time booking (Persistent Database).
          </p>
        </div>

        {isAdmin && (
          <div className="header-actions">
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={15} />
              + Add Facility
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

      {/* Facilities Grid */}
      {loading ? (
        <p>Loading facilities and room allocations...</p>
      ) : rooms.length === 0 ? (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)" }}>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            No facilities currently registered in the database.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                background: "#ffffff",
                border: "1px solid var(--sage-border)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: "16px", color: "var(--text-dark)", fontFamily: "var(--font-serif)" }}>
                      {room.roomNumber}
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{room.buildingName}</span>
                  </div>
                  {(room.isAvailable !== undefined ? room.isAvailable : room.available) ? (
                    <span className="badge badge-present" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={12} /> Available
                    </span>
                  ) : (
                    <span className="badge badge-absent" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <XCircle size={12} /> {room.maintenanceStatus === "UNDER_MAINTENANCE" ? "Maintenance" : "Occupied"}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "13px", color: "var(--text-dark)", display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  <div><strong>Type:</strong> {room.roomType} (Capacity: {room.capacity} seats)</div>
                  <div><strong>Equipment:</strong> {room.equipment || "Standard Whiteboard & Projector"}</div>
                  {room.maintenanceStatus === "UNDER_MAINTENANCE" && (
                    <div style={{ color: "#d97706", display: "flex", alignItems: "center", gap: 4 }}>
                      <Wrench size={13} /> Scheduled Maintenance Active
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12, borderTop: "1px solid var(--sage-border)", paddingTop: 12 }}>
                {isStaff && (
                  <button
                    type="button"
                    onClick={() => handleToggleBooking(room)}
                    style={{
                      flex: 1,
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: "12px",
                      fontWeight: "600",
                      background: (room.isAvailable !== undefined ? room.isAvailable : room.available) ? "var(--sage-primary)" : "var(--sage-subtle)",
                      color: (room.isAvailable !== undefined ? room.isAvailable : room.available) ? "#ffffff" : "var(--text-dark)",
                      border: "1px solid var(--sage-border)",
                      cursor: "pointer",
                    }}
                  >
                    {(room.isAvailable !== undefined ? room.isAvailable : room.available) ? "Book Room" : "Release Room"}
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: "12px",
                      background: "transparent",
                      color: "var(--danger)",
                      border: "1px solid var(--danger-border)",
                      cursor: "pointer",
                    }}
                    title="Delete Facility"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Facility Modal */}
      {showAddModal && (
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-serif)" }}>
                Add New Educational Facility
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {demoRoomIndex > 0 && (
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
                    #{((demoRoomIndex - 1) % RESOURCE_DEMO_SAMPLES.length) + 1}
                  </span>
                )}
                <button
                  type="button"
                  className="quick-demo-btn"
                  onClick={prefillDemoRoom}
                  title="Click repeatedly to cycle different facility samples"
                >
                  ✨ Autofill Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleAddRoom}>
              <div style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                  Room Number / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Lab 205, Lecture Hall C"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                  Building Name / Block
                </label>
                <input
                  type="text"
                  value={newRoom.buildingName}
                  onChange={(e) => setNewRoom({ ...newRoom, buildingName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="form-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                    Facility Type
                  </label>
                  <select
                    value={newRoom.roomType}
                    onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Laboratory">Science Lab</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium / Hall</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                  Equipment & Amenities
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smartboard, Dual Projectors, Microscopes"
                  value={newRoom.equipment}
                  onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--sage-border)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  {submitting ? "Saving to Database..." : "Save Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ResourceManagementView;
