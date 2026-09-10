package com.examly.springapp.service;

import com.examly.springapp.model.ScheduleEntry;
import com.examly.springapp.repository.ScheduleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<ScheduleEntry> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public ScheduleEntry getScheduleById(Long id) {
        Optional<ScheduleEntry> schedule =
                scheduleRepository.findById(id);

        if (schedule.isPresent()) {
            return schedule.get();
        }

        throw new RuntimeException("Schedule entry not found with id: " + id);
    }

    public ScheduleEntry addSchedule(ScheduleEntry scheduleEntry) {
        return scheduleRepository.save(scheduleEntry);
    }

    public ScheduleEntry updateSchedule(
            Long id,
            ScheduleEntry scheduleEntry) {

        Optional<ScheduleEntry> existing =
                scheduleRepository.findById(id);

        if (existing.isPresent()) {

            ScheduleEntry schedule = existing.get();

            schedule.setClassName(scheduleEntry.getClassName());
            schedule.setSubject(scheduleEntry.getSubject());
            schedule.setTeacherName(scheduleEntry.getTeacherName());
            schedule.setDayOfWeek(scheduleEntry.getDayOfWeek());
            schedule.setStartTime(scheduleEntry.getStartTime());
            schedule.setEndTime(scheduleEntry.getEndTime());
            schedule.setAttendanceNote(scheduleEntry.getAttendanceNote());

            return scheduleRepository.save(schedule);
        }

        throw new RuntimeException(
                "Schedule entry not found with id: " + id
        );
    }

    public boolean deleteSchedule(Long id) {
        Optional<ScheduleEntry> existing =
                scheduleRepository.findById(id);

        if (existing.isPresent()) {
            scheduleRepository.deleteById(id);
            return true;
        }

        return false;
    }
}