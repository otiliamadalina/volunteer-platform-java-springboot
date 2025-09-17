package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/org")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private EventService eventService;

    private static final String UPLOAD_DIR = "uploads/events/";

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
                            // ensure role is ORGANISATION when resolving org email
                            if (roleAttr instanceof String) {
                                String role = (String) roleAttr;
                                if (!"ORGANISATION".equalsIgnoreCase(role)) {
                                    return null;
                                }
                            }
                            return p;
                        }
                    }
                }
                // Fallback: header provided by frontend if session context is not available
                String headerEmail = request.getHeader("X-Org-Email");
                if (headerEmail != null && !headerEmail.isBlank()) {
                    return headerEmail.trim();
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

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
            System.out.println("=== CREATE EVENT REQUEST ===");
            System.out.println("Principal: " + (principal != null ? principal.getName() : "null"));
            System.out.println("Title: " + title);
            System.out.println("Image: " + (image != null ? image.getOriginalFilename() : "null"));
            
          
            String organisationEmail = eventService.resolveOrganisationEmail(principal, request);

            if (organisationEmail == null) {
                System.out.println("ERROR: Could not resolve organisation email from security context or session");
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            System.out.println("Organisation email: " + organisationEmail);
            
            Event savedEvent = eventService.createEvent(title, description, location, startDate, endDate, maxVolunteers, image, organisationEmail);
            System.out.println("Event saved successfully with ID: " + savedEvent.getId());
            
            return ResponseEntity.ok(savedEvent);
            
        } catch (Exception e) {
            System.err.println("Error creating event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating event: " + e.getMessage());
        }
    }

    @GetMapping("/events")
    public ResponseEntity<?> getOrganisationEvents(Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = eventService.resolveOrganisationEmail(principal, request);
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            List<Event> events = eventService.listOrganisationEvents(organisationEmail);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("Error fetching events: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching events: " + e.getMessage());
        }
    }

    @PutMapping("/events/{id}/publish")
    public ResponseEntity<?> publishEvent(@PathVariable Long id, Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = eventService.resolveOrganisationEmail(principal, request);

            Event event = eventService.publishEvent(id, organisationEmail);
            if (event == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error publishing event: " + e.getMessage());
        }
    }

    @GetMapping("/events/joined")
    public ResponseEntity<?> getJoinedEvents(Principal principal) {
        System.out.println("=== GET /api/events/joined endpoint hit ===");
        try {
            if (principal == null) {
                System.out.println("DEBUG: Principal is null, returning unauthorized.");
                return ResponseEntity.status(401).body("User not authenticated");
            }
            String email = principal.getName();
            System.out.println("DEBUG: Principal name/email is: " + email);
            List<Event> events = eventService.getEventsJoinedByVolunteer(email);
            System.out.println("DEBUG: Returned from service. Found " + events.size() + " events.");
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("ERROR: Unhandled exception in getJoinedEvents: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching joined events");
        }
    }


    // Public endpoints
    @GetMapping("/public/events")
    public ResponseEntity<?> listPublishedEvents() {
        try {
            List<Event> events = eventService.listPublishedEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching events: " + e.getMessage());
        }
    }

    @PostMapping("/events/{id}/join")
    public ResponseEntity<?> joinEvent(@PathVariable Long id, Principal principal, HttpServletRequest request) {
        try {
            String volunteerEmail = principal.getName(); // voluntarul logat
            eventService.joinEvent(id, volunteerEmail);  // apel la service
            return ResponseEntity.ok(Map.of("message", "Joined successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    }



    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id, Principal principal) {
        try {
            String organisationEmail = principal.getName();
            Event event = eventService.getEventForOrganisation(id, organisationEmail);

            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(event);
        } catch (Exception e) {
            System.err.println("Error fetching event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching event: " + e.getMessage());
        }
    }

    @PutMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(
            @PathVariable Long id,
            @RequestParam(value = "status", required = false) String statusParam,
            @RequestBody(required = false) Map<String, String> requestBody,
            Principal principal,
            HttpServletRequest request) {
        try {
            String organisationEmail = resolveOrganisationEmail(principal, request);

            String newStatus = statusParam;
            if ((newStatus == null || newStatus.isBlank()) && requestBody != null) {
                newStatus = requestBody.get("status");
            }
            if (newStatus == null || newStatus.isBlank()) {
                // Default to PUBLISHED when not provided (e.g., simple Publish action)
                newStatus = "PUBLISHED";
            }

            Event event = eventRepository.findById(id).orElse(null);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            // Only owner can change; TEMP allow if no email resolved
            if (organisationEmail != null && !event.getOrganisationEmail().equals(organisationEmail)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            try {
                EventStatus status = EventStatus.valueOf(newStatus.toUpperCase());
                event.setStatus(status);
                eventRepository.save(event);
                return ResponseEntity.ok(event);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status: " + newStatus);
            }

        } catch (Exception e) {
            System.err.println("Error updating event status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating event status: " + e.getMessage());
        }
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Principal principal, HttpServletRequest request) {
        try {
            String organisationEmail = eventService.resolveOrganisationEmail(principal, request);
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            Event event = eventRepository.findById(id).orElse(null);
            
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (!event.getOrganisationEmail().equals(organisationEmail)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            if (event.getImageUrl() != null) {
                deleteImage(event.getImageUrl());
            }
            
            eventRepository.delete(event);
            return ResponseEntity.ok().body("Event deleted successfully");
            
        } catch (Exception e) {
            System.err.println("Error deleting event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting event: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
       
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = image.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + fileExtension;
        
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return "/uploads/events/" + filename;
    }

    private void deleteImage(String imageUrl) {
        try {
            if (imageUrl != null && imageUrl.startsWith("/uploads/events/")) {
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get(UPLOAD_DIR + filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }


}
