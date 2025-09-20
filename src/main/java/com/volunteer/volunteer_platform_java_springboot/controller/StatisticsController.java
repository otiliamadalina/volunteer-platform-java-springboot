package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.StatisticsDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api")
public class StatisticsController {

    private final VolunteerRepository volunteerRepository;
    private final OrganisationRepository organisationRepository;
    private final EventRepository eventRepository;

    public StatisticsController(VolunteerRepository volunteerRepository,
                                OrganisationRepository organisationRepository,
                                EventRepository eventRepository) {
        this.volunteerRepository = volunteerRepository;
        this.organisationRepository = organisationRepository;
        this.eventRepository = eventRepository;
    }

    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDTO> getStatistics() {
        long totalVolunteers = volunteerRepository.count();
        long totalOrganisations = organisationRepository.count();
        long totalEvents = eventRepository.count();
        long publishedEvents = eventRepository.findByStatusOrderByStartDateAsc(EventStatus.PUBLISHED).size();
        long completedEvents = eventRepository.findByStatusOrderByStartDateAsc(EventStatus.COMPLETED).size();

        List<Event> recent = eventRepository.findAll().stream()
                .sorted(Comparator.comparing(Event::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(6)
                .collect(Collectors.toList());

        StatisticsDTO dto = new StatisticsDTO();
        dto.setTotalVolunteers(totalVolunteers);
        dto.setTotalOrganisations(totalOrganisations);
        dto.setTotalEvents(totalEvents);
        dto.setPublishedEvents(publishedEvents);
        dto.setCompletedEvents(completedEvents);
        dto.setRecentEvents(
                recent.stream()
                        .map(e -> new StatisticsDTO.EventSummary(
                                e.getId(), e.getTitle(), e.getLocation(), e.getStartDate(), e.getStatus()
                        ))
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(dto);
    }
}
