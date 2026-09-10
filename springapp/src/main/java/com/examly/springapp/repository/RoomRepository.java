package com.examly.springapp.repository;

import com.examly.springapp.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByIsAvailable(boolean isAvailable);

    List<Room> findByRoomType(String roomType);
}
