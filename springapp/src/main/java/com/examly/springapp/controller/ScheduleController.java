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
        if (scheduleEntry.getStartTime() != null && scheduleEntry.getEndTime() != null
                && !scheduleEntry.getStartTime().trim().isEmpty() && !scheduleEntry.getEndTime().trim().isEmpty()
                && scheduleEntry.getStartTime().trim().compareTo(scheduleEntry.getEndTime().trim()) >= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "End time must be later than start time"));
        }

        // Conflict Detection: Check Teacher & Room Availability
        List<ScheduleEntry> existingList = scheduleService.getAllSchedules();
        for (ScheduleEntry ex : existingList) {
            boolean sameDay = ex.getDayOfWeek() != null && ex.getDayOfWeek().equalsIgnoreCase(scheduleEntry.getDayOfWeek());
            boolean overlaps = sameDay && isTimeOverlapping(ex.getStartTime(), ex.getEndTime(), scheduleEntry.getStartTime(), scheduleEntry.getEndTime());

            if (overlaps) {
                // Class conflict
                if (ex.getClassName() != null && scheduleEntry.getClassName() != null
                        && ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName().trim())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Class conflict: Class " + scheduleEntry.getClassName() + " already has a timetable entry for this period on " + scheduleEntry.getDayOfWeek() + " (" + ex.getStartTime() + " - " + ex.getEndTime() + ")"
                    ));
                }
                // Teacher conflict
                if (ex.getTeacherName() != null && scheduleEntry.getTeacherName() != null 
                        && !ex.getTeacherName().trim().isEmpty() 
                        && ex.getTeacherName().equalsIgnoreCase(scheduleEntry.getTeacherName().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Teacher conflict: " + scheduleEntry.getTeacherName() + " is already assigned to " + ex.getClassName() + " (" + ex.getSubject() + ") on " + scheduleEntry.getDayOfWeek() + " (" + ex.getStartTime() + " - " + ex.getEndTime() + ")"
                    ));
                }
                // Room conflict (if attendanceNote / room specifies facility)
                if (ex.getAttendanceNote() != null && scheduleEntry.getAttendanceNote() != null
                        && !ex.getAttendanceNote().trim().isEmpty()
                        && !isGenericAttendanceNote(ex.getAttendanceNote())
                        && ex.getAttendanceNote().trim().equalsIgnoreCase(scheduleEntry.getAttendanceNote().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Facility conflict: " + scheduleEntry.getAttendanceNote() + " is already in use by Class " + ex.getClassName() + " on " + scheduleEntry.getDayOfWeek() + " (" + ex.getStartTime() + " - " + ex.getEndTime() + ")"
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

        if (scheduleEntry.getStartTime() != null && scheduleEntry.getEndTime() != null
                && !scheduleEntry.getStartTime().trim().isEmpty() && !scheduleEntry.getEndTime().trim().isEmpty()
                && scheduleEntry.getStartTime().trim().compareTo(scheduleEntry.getEndTime().trim()) >= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "End time must be later than start time"));
        }

        // Conflict Detection: Check Teacher & Room Availability for update
        List<ScheduleEntry> existingList = scheduleService.getAllSchedules();
        for (ScheduleEntry ex : existingList) {
            if (ex.getId() != null && ex.getId().equals(id)) continue;
            boolean sameDay = ex.getDayOfWeek() != null && ex.getDayOfWeek().equalsIgnoreCase(scheduleEntry.getDayOfWeek());
            boolean overlaps = sameDay && isTimeOverlapping(ex.getStartTime(), ex.getEndTime(), scheduleEntry.getStartTime(), scheduleEntry.getEndTime());

            if (overlaps) {
                // Class conflict
                if (ex.getClassName() != null && scheduleEntry.getClassName() != null
                        && ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName().trim())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Class conflict: Class " + scheduleEntry.getClassName() + " already has a timetable entry for this period on " + scheduleEntry.getDayOfWeek() + " (" + ex.getStartTime() + " - " + ex.getEndTime() + ")"
                    ));
                }
                // Teacher conflict
                if (ex.getTeacherName() != null && scheduleEntry.getTeacherName() != null 
                        && !ex.getTeacherName().trim().isEmpty() 
                        && ex.getTeacherName().equalsIgnoreCase(scheduleEntry.getTeacherName().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Teacher conflict: " + scheduleEntry.getTeacherName() + " is already assigned to " + ex.getClassName() + " (" + ex.getSubject() + ") on " + scheduleEntry.getDayOfWeek() + " (" + ex.getStartTime() + " - " + ex.getEndTime() + ")"
                    ));
                }
                // Room conflict (if attendanceNote / room specifies facility)
                if (ex.getAttendanceNote() != null && scheduleEntry.getAttendanceNote() != null
                        && !ex.getAttendanceNote().trim().isEmpty()
                        && !isGenericAttendanceNote(ex.getAttendanceNote())
                        && ex.getAttendanceNote().trim().equalsIgnoreCase(scheduleEntry.getAttendanceNote().trim())
                        && !ex.getClassName().equalsIgnoreCase(scheduleEntry.getClassName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "message", "Facility conflict: " + scheduleEntry.getAttendanceNote() + " is already in use by Class " + ex.getClassName() + " on " + scheduleEntry.getDayOfWeek() + " (" + ex.getStartTime() + " - " + ex.getEndTime() + ")"
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

    private boolean isTimeOverlapping(String start1, String end1, String start2, String end2) {
        if (start1 == null || start2 == null) return false;
        start1 = start1.trim();
        start2 = start2.trim();
        if (end1 == null || end1.trim().isEmpty() || end2 == null || end2.trim().isEmpty()) {
            return start1.equalsIgnoreCase(start2);
        }
        end1 = end1.trim();
        end2 = end2.trim();
        // Overlap condition: start1 < end2 && start2 < end1
        return start1.compareTo(end2) < 0 && start2.compareTo(end1) < 0;
    }

    private boolean isGenericAttendanceNote(String note) {
        if (note == null) return true;
        String n = note.trim().toLowerCase();
        return n.equals("present") || n.equals("absent") || n.equals("late") || n.equals("excused")
                || n.equals("special lecture") || n.equals("substitute") || n.equals("exam period");
    }
}