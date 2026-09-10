package com.examly.springapp.repository;

import com.examly.springapp.model.AcademicEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicEventRepository extends JpaRepository<AcademicEvent, Long> {

    List<AcademicEvent> findByAcademicYear(String academicYear);

    List<AcademicEvent> findByEventType(String eventType);
}
