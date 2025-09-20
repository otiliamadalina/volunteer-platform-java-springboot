package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.service.VolunteerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

import com.volunteer.volunteer_platform_java_springboot.model.EventVolunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.EventVolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.dto.SimpleRegistrationDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.RecentJoinDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.EventDTO;
import com.volunteer.volunteer_platform_java_springboot.service.EventService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/admin")
public class AdminController {
    private final VolunteerService volunteerService;
    private final OrganisationRepository organisationRepository;
    private final VolunteerRepository volunteerRepository;
    private final EventVolunteerRepository eventVolunteerRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    public AdminController(VolunteerService volunteerService,
                           OrganisationRepository organisationRepository,
                           VolunteerRepository volunteerRepository,
                           EventVolunteerRepository eventVolunteerRepository,
                           EventRepository eventRepository,
                           EventService eventService) {
        this.volunteerService = volunteerService;
        this.organisationRepository = organisationRepository;
        this.volunteerRepository = volunteerRepository;
        this.eventVolunteerRepository = eventVolunteerRepository;
        this.eventRepository = eventRepository;
        this.eventService = eventService;
    }

    @GetMapping("/manageVolunteers")
    public List<Volunteer> getVolunteers() {
        return volunteerService.getAllVolunteers();
    }


    @DeleteMapping("/manageVolunteers/{id}")
    public void deleteVolunteer(@PathVariable Long id) {
        volunteerService.deleteVolunteer(id);
    }

    @DeleteMapping("/organisations/{id}")
    public ResponseEntity<Void> deleteOrganisation(@PathVariable Long id) {
        if (!organisationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        organisationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recent-registrations")
    public ResponseEntity<List<SimpleRegistrationDTO>> getRecentRegistrations() {
        List<SimpleRegistrationDTO> volunteerRegs = volunteerRepository.findAll().stream()
                .filter(v -> v.getCreatedAt() != null)
                .map(v -> new SimpleRegistrationDTO("VOLUNTEER", v.getFullName(), v.getEmail(), v.getCreatedAt()))
                .collect(Collectors.toList());

        List<SimpleRegistrationDTO> orgRegs = organisationRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null)
                .map(o -> new SimpleRegistrationDTO("ORGANISATION", o.getFullName(), o.getEmail(), o.getCreatedAt()))
                .collect(Collectors.toList());

        List<SimpleRegistrationDTO> combined = new ArrayList<>();
        combined.addAll(volunteerRegs);
        combined.addAll(orgRegs);
        combined.sort(Comparator.comparing(SimpleRegistrationDTO::getCreatedAt).reversed());

        if (combined.size() > 20) {
            combined = combined.subList(0, 20);
        }
        return ResponseEntity.ok(combined);
    }

    @GetMapping("/recent-joins")
    public ResponseEntity<List<RecentJoinDTO>> getRecentJoins() {
        List<EventVolunteer> joins = eventVolunteerRepository.findTop20ByOrderByJoinedAtDesc();
        List<RecentJoinDTO> dto = joins.stream()
                .filter(ev -> ev.getJoinedAt() != null)
                .map(ev -> new RecentJoinDTO(
                        ev.getEvent() != null ? ev.getEvent().getTitle() : "Event",
                        ev.getVolunteer() != null ? ev.getVolunteer().getFullName() : null,
                        ev.getVolunteerEmail(),
                        ev.getOrganisationName(),
                        ev.getJoinedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    // ADMIN: List all events
    @GetMapping("/events")
    public ResponseEntity<List<EventDTO>> listAllEvents() {
        List<EventDTO> list = eventRepository.findAll().stream()
                .map(eventService::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // ADMIN: Get event details
    @GetMapping("/events/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(eventService::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN: Unpublish event (set to DRAFT)
    @PutMapping("/events/{id}/unpublish")
    public ResponseEntity<EventDTO> unpublishEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return ResponseEntity.notFound().build();
        event.setStatus(EventStatus.DRAFT);
        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(eventService.convertToDTO(saved));
    }

    // ADMIN: Delete event
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEventAdmin(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) return ResponseEntity.notFound().build();
        eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
