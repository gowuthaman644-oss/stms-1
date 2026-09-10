package com.examly.springapp.controller;

import com.examly.springapp.model.ScheduleEntry;
import com.examly.springapp.service.ScheduleService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping("/add")
    public ResponseEntity<ScheduleEntry> addSchedule(
            @RequestBody ScheduleEntry scheduleEntry) {

        ScheduleEntry saved =
                scheduleService.addSchedule(scheduleEntry);

        // Test expects HTTP 200
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ScheduleEntry>> getAllSchedules() {

        List<ScheduleEntry> schedules =
                scheduleService.getAllSchedules();

        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleEntry> getScheduleById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                scheduleService.getScheduleById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleEntry> updateSchedule(
            @PathVariable Long id,
            @RequestBody ScheduleEntry scheduleEntry) {

        return ResponseEntity.ok(
                scheduleService.updateSchedule(
                        id,
                        scheduleEntry
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(
            @PathVariable Long id) {

        scheduleService.deleteSchedule(id);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok(
                "Backend running successfully"
        );
    }
}