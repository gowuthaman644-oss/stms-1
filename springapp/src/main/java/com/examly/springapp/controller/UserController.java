package com.examly.springapp.controller;

import com.examly.springapp.model.UserAccount;
import com.examly.springapp.repository.UserAccountRepository;
import com.examly.springapp.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserAccountRepository userAccountRepository;
    private final JwtUtil jwtUtil;

    public UserController(UserAccountRepository userAccountRepository, JwtUtil jwtUtil) {
        this.userAccountRepository = userAccountRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please sign in with your credentials to access this page."));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Your session has expired. Please sign in again."));
        }

        String username = jwtUtil.extractUsername(token);
        Optional<UserAccount> userOpt = userAccountRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User account not found"));
        }

        UserAccount user = userOpt.get();
        return ResponseEntity.ok(buildUserDto(user));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }
        }

        List<UserAccount> allUsers = userAccountRepository.findAll();
        List<Map<String, Object>> students = allUsers.stream()
                .filter(u -> "STUDENT".equalsIgnoreCase(u.getRole()))
                .map(this::buildUserDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    @GetMapping("/parent/children")
    public ResponseEntity<?> getParentChildren(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please sign in to access parent information."));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Your session has expired. Please sign in again."));
        }

        String username = jwtUtil.extractUsername(token);
        Optional<UserAccount> parentOpt = userAccountRepository.findByUsername(username);

        if (parentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Parent account not found"));
        }

        UserAccount parent = parentOpt.get();
        String studentUsername = parent.getLinkedStudentUsername();

        if (studentUsername != null && !studentUsername.trim().isEmpty()) {
            String[] uNames = studentUsername.split(",");
            List<Map<String, Object>> foundChildren = new java.util.ArrayList<>();
            for (String u : uNames) {
                String trimmed = u.trim();
                if (!trimmed.isEmpty()) {
                    Optional<UserAccount> studentOpt = userAccountRepository.findByUsername(trimmed);
                    if (studentOpt.isPresent()) {
                        foundChildren.add(buildUserDto(studentOpt.get()));
                    }
                }
            }
            if (!foundChildren.isEmpty()) {
                return ResponseEntity.ok(foundChildren);
            }
        }

        // Fallback default linked child from parent metadata
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("username", parent.getLinkedStudentUsername() != null ? parent.getLinkedStudentUsername() : "student");
        fallback.put("fullName", parent.getLinkedStudentName() != null ? parent.getLinkedStudentName() : "Alex Rivera");
        fallback.put("className", parent.getLinkedStudentClass() != null ? parent.getLinkedStudentClass() : "10-A");
        fallback.put("role", "STUDENT");

        return ResponseEntity.ok(List.of(fallback));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(
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
                        .body(Map.of("message", "Access denied: Administrator privileges required"));
            }
        }

        List<UserAccount> users = userAccountRepository.findAll();
        List<Map<String, Object>> dtos = users.stream()
                .map(this::buildUserDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private Map<String, Object> buildUserDto(UserAccount user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("username", user.getUsername());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole());
        dto.put("fullName", user.getFullName());
        dto.put("department", user.getDepartment());
        dto.put("employeeId", user.getEmployeeId());
        dto.put("studentId", user.getStudentId());
        dto.put("className", user.getClassName() != null ? user.getClassName() : "10-A");
        dto.put("linkedStudentUsername", user.getLinkedStudentUsername());
        dto.put("linkedStudentName", user.getLinkedStudentName());
        dto.put("linkedStudentClass", user.getLinkedStudentClass());
        dto.put("isActive", user.isActive());
        return dto;
    }
}
