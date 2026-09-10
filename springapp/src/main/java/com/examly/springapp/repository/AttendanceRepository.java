package com.examly.springapp.repository;

import com.examly.springapp.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByClassName(String className);

    List<AttendanceRecord> findByTeacherName(String teacherName);

    List<AttendanceRecord> findByStudentName(String studentName);

    List<AttendanceRecord> findByStudentId(String studentId);

    List<AttendanceRecord> findByDate(String date);

    List<AttendanceRecord> findByClassNameAndDate(String className, String date);
}
