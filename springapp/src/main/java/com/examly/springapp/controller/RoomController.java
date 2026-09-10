package com.examly.springapp.controller;

import com.examly.springapp.model.Room;
import com.examly.springapp.repository.RoomRepository;
import com.examly.springapp.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomRepository roomRepository;
    private final JwtUtil jwtUtil;

    public RoomController(RoomRepository roomRepository, JwtUtil jwtUtil) {
        this.roomRepository = roomRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostConstruct
    public void seedInitialRooms() {
        if (roomRepository.count() == 0) {
            roomRepository.save(new Room("Room 101", "Main Academic Block", 40, "Classroom", "Smartboard, 4K Projector"));
            
            Room lab = new Room("Science Lab 204", "Science Pavilion", 32, "Laboratory", "Microscopes, Chemical Hoods");
            lab.setAvailable(false);
            roomRepository.save(lab);

            roomRepository.save(new Room("Comp Lab 302", "Technology Wing", 35, "Computer Lab", "35 High-spec PCs, Gigabit LAN"));
            roomRepository.save(new Room("Seminar Hall A", "Library Complex", 120, "Auditorium", "Dual Projectors, Audio System"));
            
            Room underMaint = new Room("Room 105", "Main Academic Block", 30, "Classroom", "Projector, Whiteboard");
            underMaint.setAvailable(false);
            underMaint.setMaintenanceStatus("UNDER_MAINTENANCE");
            roomRepository.save(underMaint);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRooms(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<Room> rooms = roomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        Optional<Room> opt = roomRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(opt.get());
    }

    @PostMapping
    public ResponseEntity<?> createRoom(
            @RequestBody Room room,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            String role = jwtUtil.extractRole(token);
            if (role != null && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("SYSTEM_ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only administrators can create facilities"));
            }
        }

        if (room.getRoomNumber() == null || room.getRoomNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Room number is required"));
        }

        Room saved = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @PathVariable Long id,
            @RequestBody Room updated,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            String role = jwtUtil.extractRole(token);
            if (role != null && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("SYSTEM_ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only administrators can edit facility details"));
            }
        }

        Optional<Room> opt = roomRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Room existing = opt.get();
        if (updated.getRoomNumber() != null) existing.setRoomNumber(updated.getRoomNumber());
        if (updated.getBuildingName() != null) existing.setBuildingName(updated.getBuildingName());
        if (updated.getCapacity() > 0) existing.setCapacity(updated.getCapacity());
        if (updated.getRoomType() != null) existing.setRoomType(updated.getRoomType());
        if (updated.getEquipment() != null) existing.setEquipment(updated.getEquipment());
        if (updated.getMaintenanceStatus() != null) existing.setMaintenanceStatus(updated.getMaintenanceStatus());
        existing.setAvailable(updated.isAvailable());

        Room saved = roomRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<?> bookRoom(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        Optional<Room> opt = roomRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Room room = opt.get();
        if (!room.isAvailable()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Facility is already occupied or under maintenance"));
        }

        room.setAvailable(false);
        Room saved = roomRepository.save(room);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<?> releaseRoom(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        Optional<Room> opt = roomRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Room room = opt.get();
        room.setAvailable(true);
        Room saved = roomRepository.save(room);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            String role = jwtUtil.extractRole(token);
            if (role != null && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("SYSTEM_ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only administrators can delete facilities"));
            }
        }

        if (!roomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        roomRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Facility deleted successfully"));
    }
}
