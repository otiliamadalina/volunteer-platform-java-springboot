package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find events by organisation email
    List<Event> findByOrganisationEmail(String organisationEmail);
    
    // Find events by status
    List<Event> findByStatus(EventStatus status);
    
    // Find published events
    List<Event> findByStatusOrderByStartDateAsc(EventStatus status);
    
    // Find upcoming events (start date in the future)
    @Query("SELECT e FROM Event e WHERE e.startDate > :now AND e.status = :status ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now, @Param("status") EventStatus status);
    
    // Find events by date range
    @Query("SELECT e FROM Event e WHERE e.startDate BETWEEN :startDate AND :endDate ORDER BY e.startDate ASC")
    List<Event> findEventsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find events with available volunteer spots
    @Query("SELECT e FROM Event e WHERE e.currentVolunteers < e.maxVolunteers AND e.status = :status ORDER BY e.startDate ASC")
    List<Event> findEventsWithAvailableSpots(@Param("status") EventStatus status);
}
