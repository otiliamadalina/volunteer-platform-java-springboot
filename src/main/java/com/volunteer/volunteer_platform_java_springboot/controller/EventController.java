package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.EventDTO;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import com.volunteer.volunteer_platform_java_springboot.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/org")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EventController {

    @Autowired
    private EventService eventService;

    private String resolveOrganisationEmail(Principal principal, HttpServletRequest request) {
        try {
            if (principal != null && principal.getName() != null && !"anonymousUser".equalsIgnoreCase(principal.getName())) {
                return principal.getName();
            }
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
                String p = (String) auth.getPrincipal();
                if (p != null && !"anonymousUser".equalsIgnoreCase(p) && !"GUEST".equalsIgnoreCase(p)) {
                    return p;
                }
            }
            if (request != null) {
                var session = request.getSession(false);
                if (session != null) {
                    Object roleAttr = session.getAttribute("userRole");
                    Object principalAttr = session.getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME);
                    if (principalAttr instanceof String) {
                        String p = (String) principalAttr;
                        if (p != null && !"anonymousUser".equalsIgnoreCase(p) && !"GUEST".equalsIgnoreCase(p)) {
                            if (roleAttr instanceof String && !"ORGANISATION".equalsIgnoreCase((String) roleAttr)) {
                                return null;
                            }
                            return p;
                        }
                    }
                }
                String headerEmail = request.getHeader("X-Org-Email");
                if (headerEmail != null && !headerEmail.isBlank()) {
                    return headerEmail.trim();
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    // CREATE event: Am revenit la `@RequestParam` pentru a gestiona `MultipartFile`
    @PostMapping("/events")
    public ResponseEntity<?> createEvent(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("maxVolunteers") String maxVolunteers,
            @RequestParam("image") MultipartFile image,
            Principal principal,
            HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            EventDTO savedEventDTO = eventService.createEvent(title, description, location, startDate, endDate, maxVolunteers, image, organisationEmail);
            return ResponseEntity.ok(savedEventDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating event: " + e.getMessage());
        }
    }

    // READ list of events for an organisation
    @GetMapping("/events")
    public ResponseEntity<?> getOrganisationEvents(Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            List<EventDTO> eventDTOs = eventService.listOrganisationEvents(organisationEmail);
            return ResponseEntity.ok(eventDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching events: " + e.getMessage());
        }
    }

    // UPDATE status (publish)
    @PutMapping("/events/{id}/publish")
    public ResponseEntity<?> publishEvent(@PathVariable Long id, Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);
            EventDTO eventDTO = eventService.publishEvent(id, organisationEmail);
            if (eventDTO == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(eventDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error publishing event: " + e.getMessage());
        }
    }

    // READ joined events for a volunteer
    @GetMapping("/events/joined")
    public ResponseEntity<?> getJoinedEvents(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            List<EventDTO> events = eventService.getEventsJoinedByVolunteer(principal.getName());
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching joined events");
        }
    }

    // UNJOIN event
    @PostMapping("/events/{id}/unjoin")
    public ResponseEntity<?> unjoinEvent(@PathVariable Long id, Principal principal) {
        try {
            String volunteerEmail = principal.getName();
            Map<String, Integer> updatedCounts = eventService.unjoinEvent(id, volunteerEmail);
            return ResponseEntity.ok(updatedCounts);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    }

    // READ public events
    @GetMapping("/public/events")
    public ResponseEntity<?> listPublishedEvents() {
        try {
            List<EventDTO> events = eventService.listPublishedEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching events: " + e.getMessage());
        }
    }

    // JOIN event
    @PostMapping("/events/{id}/join")
    public ResponseEntity<?> joinEvent(@PathVariable Long id, Principal principal) {
        try {
            String volunteerEmail = principal.getName();
            Map<String, Integer> result = eventService.joinEvent(id, volunteerEmail);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    }

    // READ a single event
    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id, Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            EventDTO eventDTO = eventService.getEventForOrganisation(id, organisationEmail);
            if (eventDTO == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(eventDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching event: " + e.getMessage());
        }
    }

    // UPDATE event status by body
    @PutMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody,
            Principal principal,
            HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);
            String newStatus = requestBody.get("status");
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            EventDTO eventDTO = eventService.updateEventStatus(id, newStatus, organisationEmail);
            return ResponseEntity.ok(eventDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Access denied");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating event status: " + e.getMessage());
        }
    }

    // DELETE event
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            eventService.deleteEvent(id, organisationEmail);
            return ResponseEntity.ok().body("Event deleted successfully");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Access denied");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting event: " + e.getMessage());
        }
    }
}