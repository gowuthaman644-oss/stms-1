import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, XCircle, Plus, Wrench } from "lucide-react";

const INITIAL_ROOMS = [
  {
    id: 1,
    roomNumber: "Room 101",
    buildingName: "Main Academic Block",
    capacity: 40,
    roomType: "Classroom",
    equipment: "Smartboard, 4K Projector",
    isAvailable: true,
    maintenanceStatus: "OPERATIONAL",
  },
  {
    id: 2,
    roomNumber: "Science Lab 204",
    buildingName: "Science Pavilion",
    capacity: 32,
    roomType: "Laboratory",
    equipment: "Microscopes, Chemical Hoods",
    isAvailable: false,
    maintenanceStatus: "OPERATIONAL",
  },
  {
    id: 3,
    roomNumber: "Comp Lab 302",
    buildingName: "Technology Wing",
    capacity: 35,
    roomType: "Computer Lab",
    equipment: "35 High-spec PCs, Gigabit LAN",
    isAvailable: true,
    maintenanceStatus: "OPERATIONAL",
  },
  {
    id: 4,
    roomNumber: "Seminar Hall A",
    buildingName: "Library Complex",
    capacity: 120,
    roomType: "Auditorium",
    equipment: "Dual Projectors, Audio System",
    isAvailable: true,
    maintenanceStatus: "OPERATIONAL",
  },
  {
    id: 5,
    roomNumber: "Room 105",
    buildingName: "Main Academic Block",
    capacity: 30,
    roomType: "Classroom",
    equipment: "Projector, Whiteboard",
    isAvailable: false,
    maintenanceStatus: "UNDER_MAINTENANCE",
  },
];

function ResourceManagementView() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    buildingName: "Main Academic Block",
    capacity: 30,
    roomType: "Classroom",
    equipment: "Projector, Whiteboard",
  });

  const toggleAvailability = (id) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isAvailable: !r.isAvailable } : r))
    );
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber.trim()) return;

    setRooms((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newRoom,
        isAvailable: true,
        maintenanceStatus: "OPERATIONAL",
      },
    ]);
    setShowAddModal(false);
    setNewRoom({
      roomNumber: "",
      buildingName: "Main Academic Block",
      capacity: 30,
      roomType: "Classroom",
      equipment: "Projector, Whiteboard",
    });
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
            <Building2
              size={24}
              style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
            />
            Classroom & Resource Management
          </h2>
          <p className="header-subtitle">
            Inventory of classrooms, scientific laboratories, lecture halls, and audiovisual equipment.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => setShowAddModal(!showAddModal)}
          >
            <Plus size={16} />
            {showAddModal ? "Close Form" : "Add Facility"}
          </button>
        </div>
      </div>

      {showAddModal && (
        <form
          onSubmit={handleAddRoom}
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sage-border)",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
            Add New Facility or Classroom
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Room Number / Name</label>
              <input
                type="text"
                placeholder="e.g. Room 208"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Building Name</label>
              <input
                type="text"
                value={newRoom.buildingName}
                onChange={(e) => setNewRoom({ ...newRoom, buildingName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity (Students)</label>
              <input
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <input
                type="text"
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 12 }}>
            Save Facility
          </button>
        </form>
      )}

      {/* Rooms Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Building</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Equipment</th>
              <th>Maintenance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td><strong>{room.roomNumber}</strong></td>
                <td>{room.buildingName}</td>
                <td>{room.roomType}</td>
                <td>{room.capacity} seats</td>
                <td><small style={{ color: "var(--text-muted)" }}>{room.equipment}</small></td>
                <td>
                  {room.maintenanceStatus === "OPERATIONAL" ? (
                    <span className="badge badge-present">Operational</span>
                  ) : (
                    <span className="badge badge-absent" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Wrench size={12} /> Maintenance
                    </span>
                  )}
                </td>
                <td>
                  {room.isAvailable ? (
                    <span className="badge badge-present" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={12} /> Available
                    </span>
                  ) : (
                    <span className="badge badge-absent" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <XCircle size={12} /> Booked
                    </span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleAvailability(room.id)}
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    {room.isAvailable ? "Book Room" : "Release Room"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default ResourceManagementView;
