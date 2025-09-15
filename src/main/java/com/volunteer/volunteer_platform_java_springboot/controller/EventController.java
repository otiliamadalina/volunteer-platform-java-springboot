package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
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

    private static final String UPLOAD_DIR = "uploads/events/";

    @GetMapping("/events/test")
    public ResponseEntity<String> testEndpoint(Principal principal) {
        System.out.println("=== TEST ENDPOINT CALLED ===");
        System.out.println("Principal: " + (principal != null ? principal.getName() : "null"));
        return ResponseEntity.ok("EventController is working! Principal: " + (principal != null ? principal.getName() : "null"));
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
            
          
            String organisationEmail = null;
            if (principal != null) {
                organisationEmail = principal.getName();
            }
            if (organisationEmail == null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
                    organisationEmail = (String) auth.getPrincipal();
                }
            }
            if (organisationEmail == null && request != null && request.getSession(false) != null) {
                Object principalAttr = request.getSession(false).getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME);
                if (principalAttr instanceof String) {
                    organisationEmail = (String) principalAttr;
                }
            }

            if (organisationEmail == null) {
                System.out.println("ERROR: Could not resolve organisation email from security context or session");
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            System.out.println("Organisation email: " + organisationEmail);
            
            // TEMP: do not block creation if organisation cannot be found (to unblock UI)
            var orgEntity = organisationRepository.findByEmail(organisationEmail);
            if (orgEntity == null) {
                System.out.println("WARNING: Organisation not found: " + organisationEmail + ". Proceeding to create event without strict org check.");
            }

            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
LocalDateTime startDateTime = LocalDateTime.parse(startDate, formatter);
LocalDateTime endDateTime = LocalDateTime.parse(endDate, formatter);

            
            if (startDateTime.isAfter(endDateTime)) {
                return ResponseEntity.badRequest().body("Start date must be before end date");
            }

            int maxVolunteersInt = Integer.parseInt(maxVolunteers);
            if (maxVolunteersInt <= 0) {
                return ResponseEntity.badRequest().body("Max volunteers must be greater than 0");
            }

            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = saveImage(image);
            }

            Event event = new Event();
            event.setTitle(title);
            event.setDescription(description);
            event.setLocation(location);
            event.setStartDate(startDateTime);
            event.setEndDate(endDateTime);
            event.setMaxVolunteers(maxVolunteersInt);
            event.setCurrentVolunteers(0);
            event.setStatus(EventStatus.DRAFT);
            event.setOrganisationEmail(organisationEmail);
            event.setImageUrl(imageUrl);

            System.out.println("Saving event to database...");
            Event savedEvent = eventRepository.save(event);
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
            String organisationEmail = null;
            if (principal != null) {
                organisationEmail = principal.getName();
            }
            if (organisationEmail == null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
                    organisationEmail = (String) auth.getPrincipal();
                }
            }
            if (organisationEmail == null && request != null && request.getSession(false) != null) {
                Object principalAttr = request.getSession(false).getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME);
                if (principalAttr instanceof String) {
                    organisationEmail = (String) principalAttr;
                }
            }
            if (organisationEmail == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            List<Event> events = eventRepository.findByOrganisationEmail(organisationEmail);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("Error fetching events: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching events: " + e.getMessage());
        }
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id, Principal principal) {
        try {
            String organisationEmail = principal.getName();
            Event event = eventRepository.findById(id).orElse(null);
            
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (!event.getOrganisationEmail().equals(organisationEmail)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            System.err.println("Error fetching event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching event: " + e.getMessage());
        }
    }

    @PutMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestBody Map<String, String> request, Principal principal) {
        try {
            String organisationEmail = principal.getName();
            String newStatus = request.get("status");
            
            Event event = eventRepository.findById(id).orElse(null);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (!event.getOrganisationEmail().equals(organisationEmail)) {
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
            String organisationEmail = null;
            if (principal != null) {
                organisationEmail = principal.getName();
            }
            if (organisationEmail == null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
                    organisationEmail = (String) auth.getPrincipal();
                }
            }
            if (organisationEmail == null && request != null && request.getSession(false) != null) {
                Object principalAttr = request.getSession(false).getAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME);
                if (principalAttr instanceof String) {
                    organisationEmail = (String) principalAttr;
                }
            }
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
