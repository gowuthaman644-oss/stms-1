package com.examly.springapp.controller;

import com.examly.springapp.model.ScheduleEntry;
import com.examly.springapp.service.ScheduleService;
import com.examly.springapp.util.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final JwtUtil jwtUtil;

    public ScheduleController(ScheduleService scheduleService, JwtUtil jwtUtil) {
        this.scheduleService = scheduleService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSchedule(
            @RequestBody ScheduleEntry scheduleEntry,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            String role = jwtUtil.extractRole(token);
            if (role != null && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("SYSTEM_ADMIN") && !role.equalsIgnoreCase("TEACHER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied: Only teachers and administrators can create timetable entries"));
            }
        }

        if (scheduleEntry.getClassName() == null || scheduleEntry.getClassName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Class name is required"));
        }
        if (scheduleEntry.getSubject() == null || scheduleEntry.getSubject().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Subject is required"));
        }

        // Conflict Detection: Check Teacher & Room Availability
        List<ScheduleEntry> existingList = scheduleService.getAllSchedules();
        for (ScheduleEntry ex : existingList) {
            boolean sameDay = ex.getDayOfWeek() != null && ex.getDayOfWeek().equalsIgnoreCase(scheduleEntry.getDayOfWeek());
            boolean sameTime = ex.getStartTime() != null && ex.getStartTime().equalsIgnoreCase(scheduleEntry.getStartTime());

            if (sameDay && sameTime) {
                // Class conflict
                if (ex.getClassName() != null && scheduleEntry.getClassName() != null
                        && ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName().trim())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Class conflict: Class " + scheduleEntry.getClassName() + " already has a timetable entry for this period on " + scheduleEntry.getDayOfWeek() + " at " + scheduleEntry.getStartTime()
                    ));
                }
                // Teacher conflict
                if (ex.getTeacherName() != null && scheduleEntry.getTeacherName() != null 
                        && !ex.getTeacherName().trim().isEmpty() 
                        && ex.getTeacherName().equalsIgnoreCase(scheduleEntry.getTeacherName().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Teacher conflict: " + scheduleEntry.getTeacherName() + " is already assigned to " + ex.getClassName() + " (" + ex.getSubject() + ") on " + scheduleEntry.getDayOfWeek() + " at " + scheduleEntry.getStartTime()
                    ));
                }
                // Room conflict (if attendanceNote / room specifies facility)
                if (ex.getAttendanceNote() != null && scheduleEntry.getAttendanceNote() != null
                        && !ex.getAttendanceNote().trim().isEmpty()
                        && ex.getAttendanceNote().toLowerCase().contains("room")
                        && ex.getAttendanceNote().equalsIgnoreCase(scheduleEntry.getAttendanceNote().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Facility conflict: " + scheduleEntry.getAttendanceNote() + " is already in use by " + ex.getClassName() + " on " + scheduleEntry.getDayOfWeek() + " at " + scheduleEntry.getStartTime()
                    ));
                }
            }
        }

        ScheduleEntry saved = scheduleService.addSchedule(scheduleEntry);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllSchedules(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<ScheduleEntry> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScheduleById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        ScheduleEntry entry = scheduleService.getScheduleById(id);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(
            @PathVariable Long id,
            @RequestBody ScheduleEntry scheduleEntry,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            String role = jwtUtil.extractRole(token);
            if (role != null && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("SYSTEM_ADMIN") && !role.equalsIgnoreCase("TEACHER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied: Only teachers and administrators can modify timetable entries"));
            }
        }

        // Conflict Detection: Check Teacher & Room Availability for update
        List<ScheduleEntry> existingList = scheduleService.getAllSchedules();
        for (ScheduleEntry ex : existingList) {
            if (ex.getId() != null && ex.getId().equals(id)) continue;
            boolean sameDay = ex.getDayOfWeek() != null && ex.getDayOfWeek().equalsIgnoreCase(scheduleEntry.getDayOfWeek());
            boolean sameTime = ex.getStartTime() != null && ex.getStartTime().equalsIgnoreCase(scheduleEntry.getStartTime());

            if (sameDay && sameTime) {
                // Class conflict
                if (ex.getClassName() != null && scheduleEntry.getClassName() != null
                        && ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName().trim())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Class conflict: Class " + scheduleEntry.getClassName() + " already has a timetable entry for this period on " + scheduleEntry.getDayOfWeek() + " at " + scheduleEntry.getStartTime()
                    ));
                }
                // Teacher conflict
                if (ex.getTeacherName() != null && scheduleEntry.getTeacherName() != null 
                        && !ex.getTeacherName().trim().isEmpty() 
                        && ex.getTeacherName().equalsIgnoreCase(scheduleEntry.getTeacherName().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Teacher conflict: " + scheduleEntry.getTeacherName() + " is already assigned to " + ex.getClassName() + " (" + ex.getSubject() + ") on " + scheduleEntry.getDayOfWeek() + " at " + scheduleEntry.getStartTime()
                    ));
                }
                // Room conflict (if attendanceNote / room specifies facility)
                if (ex.getAttendanceNote() != null && scheduleEntry.getAttendanceNote() != null
                        && !ex.getAttendanceNote().trim().isEmpty()
                        && ex.getAttendanceNote().toLowerCase().contains("room")
                        && ex.getAttendanceNote().equalsIgnoreCase(scheduleEntry.getAttendanceNote().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Facility conflict: " + scheduleEntry.getAttendanceNote() + " is already in use by " + ex.getClassName() + " on " + scheduleEntry.getDayOfWeek() + " at " + scheduleEntry.getStartTime()
                    ));
                }
            }
        }

        ScheduleEntry updated = scheduleService.updateSchedule(id, scheduleEntry);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            String role = jwtUtil.extractRole(token);
            if (role != null && !role.equalsIgnoreCase("ADMIN") && !role.equalsIgnoreCase("SYSTEM_ADMIN") && !role.equalsIgnoreCase("TEACHER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied: Only teachers and administrators can delete timetable entries"));
            }
        }

        ScheduleEntry existing = scheduleService.getScheduleById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(Map.of("message", "Schedule entry deleted successfully"));
    }
}