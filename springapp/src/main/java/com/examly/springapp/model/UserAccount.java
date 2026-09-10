package com.examly.springapp.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_accounts")
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String passwordHash;
    private String role; // SYSTEM_ADMIN, ADMIN, TEACHER, STUDENT, PARENT
    private String fullName;
    private String department;
    private String employeeId;
    private String studentId;
    private String className; // e.g. "10-A"
    private String linkedStudentUsername; // for Parent role
    private String linkedStudentName;     // for Parent role
    private String linkedStudentClass;    // for Parent role
    private boolean isActive = true;

    public UserAccount() {
    }

    public UserAccount(String username, String email, String passwordHash, String role, String fullName, String department, String employeeId, String studentId) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.fullName = fullName;
        this.department = department;
        this.employeeId = employeeId;
        this.studentId = studentId;
        this.isActive = true;
    }

    public UserAccount(String username, String email, String passwordHash, String role, String fullName, String department, String employeeId, String studentId, String className) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.fullName = fullName;
        this.department = department;
        this.employeeId = employeeId;
        this.studentId = studentId;
        this.className = className;
        this.isActive = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getLinkedStudentUsername() {
        return linkedStudentUsername;
    }

    public void setLinkedStudentUsername(String linkedStudentUsername) {
        this.linkedStudentUsername = linkedStudentUsername;
    }

    public String getLinkedStudentName() {
        return linkedStudentName;
    }

    public void setLinkedStudentName(String linkedStudentName) {
        this.linkedStudentName = linkedStudentName;
    }

    public String getLinkedStudentClass() {
        return linkedStudentClass;
    }

    public void setLinkedStudentClass(String linkedStudentClass) {
        this.linkedStudentClass = linkedStudentClass;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
