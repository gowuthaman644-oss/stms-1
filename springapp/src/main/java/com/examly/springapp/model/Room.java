package com.examly.springapp.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String buildingName;
    private int capacity;
    private String roomType; // LECTURE_HALL, SCIENCE_LAB, COMPUTER_LAB, SEMINAR_ROOM, CLASSROOM
    private String equipment; // Projector, Smart Board, Microscopes, etc.
    private boolean isAvailable = true;
    private String maintenanceStatus = "OPERATIONAL"; // OPERATIONAL, UNDER_MAINTENANCE

    public Room() {
    }

    public Room(String roomNumber, String buildingName, int capacity, String roomType, String equipment) {
        this.roomNumber = roomNumber;
        this.buildingName = buildingName;
        this.capacity = capacity;
        this.roomType = roomType;
        this.equipment = equipment;
        this.isAvailable = true;
        this.maintenanceStatus = "OPERATIONAL";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getMaintenanceStatus() {
        return maintenanceStatus;
    }

    public void setMaintenanceStatus(String maintenanceStatus) {
        this.maintenanceStatus = maintenanceStatus;
    }
}
