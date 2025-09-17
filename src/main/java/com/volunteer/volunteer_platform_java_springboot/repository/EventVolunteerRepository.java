package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.EventVolunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventVolunteerRepository extends JpaRepository<EventVolunteer, Long> {
    Optional<EventVolunteer> findByEventIdAndVolunteerId(Long eventId, Long volunteerId);

}
