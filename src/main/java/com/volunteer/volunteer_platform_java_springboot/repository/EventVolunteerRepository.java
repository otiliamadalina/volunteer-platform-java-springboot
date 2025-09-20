package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.EventVolunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventVolunteerRepository extends JpaRepository<EventVolunteer, Long> {
    Optional<EventVolunteer> findByEventIdAndVolunteerId(Long eventId, Long volunteerId);

    @Query("SELECT ev.event.id FROM EventVolunteer ev WHERE ev.volunteerEmail = :email")
    List<Long> findEventIdsByVolunteerEmail(@Param("email") String email);

    EventVolunteer findByEventIdAndVolunteerEmail(Long eventId, String email);


    List<EventVolunteer> findByOrganisationEmail(String organisationEmail);

    List<EventVolunteer> findTop20ByOrderByJoinedAtDesc();

}
