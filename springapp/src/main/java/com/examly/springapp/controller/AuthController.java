package com.examly.springapp.controller;

import com.examly.springapp.model.UserAccount;
import com.examly.springapp.repository.UserAccountRepository;
import com.examly.springapp.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserAccountRepository userAccountRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserAccountRepository userAccountRepository, JwtUtil jwtUtil) {
        this.userAccountRepository = userAccountRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String role = request.getOrDefault("role", "STUDENT").toUpperCase();
        String fullName = request.getOrDefault("fullName", username);
        String className = request.getOrDefault("className", "10-A");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
        }
        if (password == null || password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }

        if (userAccountRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already exists"));
        }

        UserAccount user = new UserAccount(
                username,
                email != null ? email : username + "@stms.edu",
                password,
                role,
                fullName,
                request.getOrDefault("department", "General Academics"),
                request.getOrDefault("employeeId", ""),
                request.getOrDefault("studentId", "STU-" + (1000 + (int)(Math.random() * 9000))),
                className
        );

        if ("PARENT".equalsIgnoreCase(role)) {
            user.setLinkedStudentUsername(request.getOrDefault("linkedStudentUsername", "student"));
            user.setLinkedStudentName(request.getOrDefault("linkedStudentName", "Alex Rivera"));
            user.setLinkedStudentClass(request.getOrDefault("linkedStudentClass", "10-A"));
        }

        UserAccount saved = userAccountRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole(), saved.getFullName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Registration successful");
        response.put("user", buildUserDto(saved));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password required"));
        }

        Optional<UserAccount> userOpt = userAccountRepository.findByUsername(username);

        UserAccount user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (!user.getPasswordHash().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid username or password"));
            }
        } else {
            user = getPreloadedDemoUser(username, password);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid username or password"));
            }
            user = userAccountRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getFullName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Login successful");
        response.put("user", buildUserDto(user));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
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

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(buildUserDto(userOpt.get()));
        }

        String role = jwtUtil.extractRole(token);
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("username", username);
        fallback.put("role", role);
        fallback.put("authenticated", true);

        return ResponseEntity.ok(fallback);
    }

    private UserAccount getPreloadedDemoUser(String username, String password) {
        if ("admin".equalsIgnoreCase(username) && "admin123".equals(password)) {
            return new UserAccount("admin", "admin@stms.edu", "admin123", "ADMIN", "Dr. Arthur Vance", "Administration", "EMP001", "", "All");
        } else if ("teacher".equalsIgnoreCase(username) && "teacher123".equals(password)) {
            return new UserAccount("teacher", "c.evans@stms.edu", "teacher123", "TEACHER", "Prof. Clara Evans", "Science & Biology", "EMP014", "", "10-A");
        } else if ("student".equalsIgnoreCase(username) && "student123".equals(password)) {
            return new UserAccount("student", "a.rivera@student.stms.edu", "student123", "STUDENT", "Alex Rivera", "Secondary School", "", "STU1024", "10-A");
        } else if ("parent".equalsIgnoreCase(username) && "parent123".equals(password)) {
            UserAccount p = new UserAccount("parent", "s.rivera@parent.stms.edu", "parent123", "PARENT", "Sarah Rivera", "Parent Community", "", "", "10-A");
            p.setLinkedStudentUsername("student");
            p.setLinkedStudentName("Alex Rivera");
            p.setLinkedStudentClass("10-A");
            return p;
        }
        return null;
    }

    private Map<String, Object> buildUserDto(UserAccount user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("username", user.getUsername());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole());
        dto.put("fullName", user.getFullName());
        dto.put("department", user.getDepartment());
        dto.put("studentId", user.getStudentId());
        dto.put("employeeId", user.getEmployeeId());
        dto.put("className", user.getClassName() != null ? user.getClassName() : "10-A");
        dto.put("linkedStudentUsername", user.getLinkedStudentUsername());
        dto.put("linkedStudentName", user.getLinkedStudentName());
        dto.put("linkedStudentClass", user.getLinkedStudentClass());
        return dto;
    }
}
