package com.examly.springapp.controller;

import com.examly.springapp.model.AcademicEvent;
import com.examly.springapp.repository.AcademicEventRepository;
import com.examly.springapp.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class AcademicEventController {

    private final AcademicEventRepository academicEventRepository;
    private final JwtUtil jwtUtil;

    public AcademicEventController(AcademicEventRepository academicEventRepository, JwtUtil jwtUtil) {
        this.academicEventRepository = academicEventRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllEvents(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<AcademicEvent> events = academicEventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(
            @RequestBody AcademicEvent event,
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
                        .body(Map.of("message", "Only administrators can add calendar events"));
            }
        }

        if (event.getEventName() == null || event.getEventName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event name is required"));
        }
        if (event.getStartDate() == null || event.getStartDate().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Start date is required"));
        }
        if (event.getEndDate() != null && !event.getEndDate().trim().isEmpty() && event.getStartDate().compareTo(event.getEndDate()) > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Start date cannot be after end date"));
        }

        AcademicEvent saved = academicEventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody AcademicEvent updated,
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
                        .body(Map.of("message", "Only administrators can update calendar events"));
            }
        }

        Optional<AcademicEvent> opt = academicEventRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (updated.getStartDate() != null && updated.getEndDate() != null && updated.getStartDate().compareTo(updated.getEndDate()) > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Start date cannot be after end date"));
        }

        AcademicEvent existing = opt.get();
        if (updated.getEventName() != null) existing.setEventName(updated.getEventName());
        if (updated.getEventType() != null) existing.setEventType(updated.getEventType());
        if (updated.getStartDate() != null) existing.setStartDate(updated.getStartDate());
        if (updated.getEndDate() != null) existing.setEndDate(updated.getEndDate());
        if (updated.getAcademicYear() != null) existing.setAcademicYear(updated.getAcademicYear());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        existing.setHoliday(updated.isHoliday());

        AcademicEvent saved = academicEventRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
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
                        .body(Map.of("message", "Only administrators can delete calendar events"));
            }
        }

        if (!academicEventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        academicEventRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Calendar event deleted successfully"));
    }
}
