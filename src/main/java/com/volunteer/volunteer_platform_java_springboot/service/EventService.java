package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import com.volunteer.volunteer_platform_java_springboot.model.EventVolunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.EventVolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.stereotype.Service;
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

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventVolunteerRepository eventVolunteerRepository;
    private final OrganisationRepository organisationRepository;
    private final VolunteerRepository volunteerRepository;

    private static final String UPLOAD_DIR = "uploads/events/";

    public EventService(EventRepository eventRepository,
                        EventVolunteerRepository eventVolunteerRepository,
                        OrganisationRepository organisationRepository,
                        VolunteerRepository volunteerRepository) {
        this.eventRepository = eventRepository;
        this.eventVolunteerRepository = eventVolunteerRepository;
        this.organisationRepository = organisationRepository;
        this.volunteerRepository = volunteerRepository;
    }

    public String resolveOrganisationEmail(Principal principal, HttpServletRequest request) {
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
                String headerEmail = request.getHeader("X-Org-Email");
                if (headerEmail != null && !headerEmail.isBlank()) {
                    return headerEmail.trim();
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    // C - CREATE
    public Event createEvent(String title,
                             String description,
                             String location,
                             String startDate,
                             String endDate,
                             String maxVolunteers,
                             MultipartFile image,
                             String organisationEmail) throws IOException {

        if (organisationEmail == null) {
            throw new IllegalStateException("User not authenticated");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime startDateTime = LocalDateTime.parse(startDate, formatter);
        LocalDateTime endDateTime = LocalDateTime.parse(endDate, formatter);

        if (startDateTime.isAfter(endDateTime)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        int maxVolunteersInt = Integer.parseInt(maxVolunteers);
        if (maxVolunteersInt <= 0) {
            throw new IllegalArgumentException("Max volunteers must be greater than 0");
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

        return eventRepository.save(event);
    }

    // R - READ
    public List<Event> listOrganisationEvents(String organisationEmail) {
        return eventRepository.findByOrganisationEmail(organisationEmail);
    }

    public Event publishEvent(Long id, String organisationEmail) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return null;
        if (organisationEmail != null && !organisationEmail.equals(event.getOrganisationEmail())) {
            throw new SecurityException("Access denied");
        }
        event.setStatus(EventStatus.PUBLISHED);
        return eventRepository.save(event);
    }

    public List<Event> listPublishedEvents() {
        return eventRepository.findByStatusOrderByStartDateAsc(EventStatus.PUBLISHED);
    }

    public Event getEventForOrganisation(Long id, String organisationEmail) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return null;
        if (!event.getOrganisationEmail().equals(organisationEmail)) {
            throw new SecurityException("Access denied");
        }
        return event;
    }

    // U - UPDATE
    public Event updateEventStatus(Long id, String newStatus, String organisationEmail) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return null;
        if (organisationEmail != null && !event.getOrganisationEmail().equals(organisationEmail)) {
            throw new SecurityException("Access denied");
        }
        EventStatus status = EventStatus.valueOf(newStatus.toUpperCase());
        event.setStatus(status);
        return eventRepository.save(event);
    }

    // D - DELETE
    public boolean deleteEvent(Long id, String organisationEmail) throws IOException {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) return false;
        if (!event.getOrganisationEmail().equals(organisationEmail)) {
            throw new SecurityException("Access denied");
        }
        if (event.getImageUrl() != null) {
            deleteImage(event.getImageUrl());
        }
        eventRepository.delete(event);
        return true;
    }

    private String saveImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();
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


    private void deleteImage(String imageUrl) throws IOException {
        if (imageUrl != null && imageUrl.startsWith("/uploads/events/")) {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).toAbsolutePath();
            Files.deleteIfExists(filePath);
        }
    }


    public List<Event> getEventsJoinedByVolunteer(String email) {
        System.out.println("DEBUG: Entering getEventsJoinedByVolunteer service method.");
        try {
            List<Long> eventIds = eventVolunteerRepository.findEventIdsByVolunteerEmail(email);
            System.out.println("DEBUG: Query for event IDs executed. Found " + eventIds.size() + " IDs.");
            return eventRepository.findAllById(eventIds);
        } catch (Exception e) {
            System.err.println("ERROR: Exception in getEventsJoinedByVolunteer: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error fetching joined events in service", e);
        }
    }


    public Map<String, Integer> joinEvent(Long eventId, String volunteerEmail) {
        // 1. Gasește event-ul
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 2. Verifica statusul
        if (event.getStatus() != EventStatus.PUBLISHED) {
            throw new IllegalStateException("Event is not published");
        }

        // 3. Verifica ddaca e plin
        if (event.getCurrentVolunteers() >= event.getMaxVolunteers()) {
            throw new IllegalStateException("Event is full");
        }

        // 4. Gasestevoluntarul
        Volunteer volunteer = volunteerRepository.findByEmail(volunteerEmail);
        if (volunteer == null) {
            throw new RuntimeException("Volunteer not found");
        }

        // 5. Verifica daca e deja înscris
        boolean alreadyJoined = eventVolunteerRepository
                .findByEventIdAndVolunteerId(event.getId(), volunteer.getId())
                .isPresent();

        if (alreadyJoined) {
            throw new RuntimeException("Volunteer already joined");
        }

        // 6. Creeaza EventVolunteer
        EventVolunteer ev = new EventVolunteer();
        ev.setEvent(event);
        ev.setVolunteer(volunteer);
        ev.setOrganisationEmail(event.getOrganisationEmail());
        ev.setVolunteerEmail(volunteer.getEmail());
        ev.setJoinedAt(LocalDateTime.now());

        eventVolunteerRepository.save(ev);

        // 7. Actualizeazanumarul de voluntari
        event.setCurrentVolunteers(event.getCurrentVolunteers() + 1);
        eventRepository.save(event);

        // 8. Returneazacifrele actualizate
        return Map.of(
                "currentVolunteers", event.getCurrentVolunteers(),
                "maxVolunteers", event.getMaxVolunteers()
        );
    }

    public Map<String, Integer> unjoinEvent(Long eventId, String volunteerEmail) {
        // 1. Find the event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 2. Find the join record
        EventVolunteer ev = eventVolunteerRepository.findByEventIdAndVolunteerEmail(eventId, volunteerEmail);

        if (ev != null) {
            // 3. Delete the join record
            eventVolunteerRepository.delete(ev);

            // 4. Decrement the volunteer count on the event
            if (event.getCurrentVolunteers() > 0) {
                event.setCurrentVolunteers(event.getCurrentVolunteers() - 1);
                eventRepository.save(event);
            }
        } else {
            throw new RuntimeException("Volunteer is not joined to this event");
        }

        // 5. Return the updated counts for the frontend
        return Map.of(
                "currentVolunteers", event.getCurrentVolunteers(),
                "maxVolunteers", event.getMaxVolunteers()
        );
    }


}








