package com.examly.springapp.controller;

import com.examly.springapp.model.AttendanceRecord;
import com.examly.springapp.repository.AttendanceRepository;
import com.examly.springapp.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final JwtUtil jwtUtil;

    public AttendanceController(AttendanceRepository attendanceRepository, JwtUtil jwtUtil) {
        this.attendanceRepository = attendanceRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllAttendance(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<AttendanceRecord> records = attendanceRepository.findAll();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/class/{className}")
    public ResponseEntity<?> getAttendanceByClass(
            @PathVariable String className,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<AttendanceRecord> records = attendanceRepository.findByClassName(className);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getAttendanceByStudent(
            @PathVariable String studentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<AttendanceRecord> records = attendanceRepository.findByStudentId(studentId);
        if (records.isEmpty()) {
            records = attendanceRepository.findByStudentName(studentId);
        }
        return ResponseEntity.ok(records);
    }

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceRecord record,
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
                        .body(Map.of("message", "Only teachers and administrators can mark student attendance"));
            }
        }

        if (record.getClassName() == null || record.getClassName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Class name is required"));
        }
        if (record.getSubject() == null || record.getSubject().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Subject is required"));
        }

        if (record.getDate() == null || record.getDate().trim().isEmpty()) {
            record.setDate(LocalDate.now().toString());
        }
        if (record.getStatus() == null || record.getStatus().trim().isEmpty()) {
            record.setStatus("PRESENT");
        }
        if (record.getRecordedAt() == null || record.getRecordedAt().trim().isEmpty()) {
            record.setRecordedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        }

        AttendanceRecord saved = attendanceRepository.save(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(
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
                        .body(Map.of("message", "Only administrators can delete attendance records"));
            }
        }

        if (!attendanceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        attendanceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Attendance record deleted successfully"));
    }
}
