package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.dto.EventDTO;
import com.volunteer.volunteer_platform_java_springboot.model.*;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.EventVolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import jakarta.servlet.http.HttpServletRequest;
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
import java.util.stream.Collectors;

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

    // Metoda de conversie (DTO -> Entity)
    public EventDTO convertToDTO(Event event) {
        if (event == null) {
            return null;
        }
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setMaxVolunteers(event.getMaxVolunteers());
        dto.setOrganisationEmail(event.getOrganisationEmail());
        dto.setImageUrl(event.getImageUrl());
        dto.setStatus(event.getStatus());
        dto.setCurrentVolunteers(event.getCurrentVolunteers());
        dto.setCreatedAt(event.getCreatedAt());

        Organisation organisation = organisationRepository.findByEmail(event.getOrganisationEmail());
        if (organisation != null) {
            dto.setOrganisationName(organisation.getFullName());
        }

        return dto;
    }

    // C - CREATE
    public EventDTO createEvent(
            String title,
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

        // Validare
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
        event.setOrganisationEmail(organisationEmail);
        event.setImageUrl(imageUrl);
        event.setStatus(EventStatus.DRAFT);
        event.setCurrentVolunteers(0);

        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    // R - READ
    public List<EventDTO> listOrganisationEvents(String organisationEmail) {
        return eventRepository.findByOrganisationEmail(organisationEmail).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO publishEvent(Long id, String organisationEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!organisationEmail.equals(event.getOrganisationEmail())) {
            throw new SecurityException("Access denied");
        }

        event.setStatus(EventStatus.PUBLISHED);
        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public List<EventDTO> listPublishedEvents() {
        return eventRepository.findByStatusOrderByStartDateAsc(EventStatus.PUBLISHED).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventForOrganisation(Long id, String organisationEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganisationEmail().equals(organisationEmail)) {
            throw new SecurityException("Access denied");
        }

        return convertToDTO(event);
    }

    // U - UPDATE
    public EventDTO updateEventStatus(Long id, String newStatus, String organisationEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganisationEmail().equals(organisationEmail)) {
            throw new SecurityException("Access denied");
        }

        try {
            EventStatus status = EventStatus.valueOf(newStatus.toUpperCase());
            event.setStatus(status);
            Event updatedEvent = eventRepository.save(event);
            return convertToDTO(updatedEvent);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
    }

    // D - DELETE
    public boolean deleteEvent(Long id, String organisationEmail) throws IOException {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganisationEmail().equals(organisationEmail)) {
            throw new SecurityException("Access denied");
        }

        if (event.getImageUrl() != null) {
            deleteImage(event.getImageUrl());
        }
        eventRepository.delete(event);
        return true;
    }

    // Metode de business logică pentru voluntari
    public List<EventDTO> getEventsJoinedByVolunteer(String email) {
        List<Long> eventIds = eventVolunteerRepository.findEventIdsByVolunteerEmail(email);
        return eventRepository.findAllById(eventIds).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Integer> joinEvent(Long eventId, String volunteerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getStatus() != EventStatus.PUBLISHED) {
            throw new IllegalStateException("Event is not published");
        }
        if (event.getCurrentVolunteers() >= event.getMaxVolunteers()) {
            throw new IllegalStateException("Event is full");
        }
        Volunteer volunteer = volunteerRepository.findByEmail(volunteerEmail);
        if (volunteer == null) {
            throw new RuntimeException("Volunteer not found");
        }
        boolean alreadyJoined = eventVolunteerRepository
                .findByEventIdAndVolunteerId(event.getId(), volunteer.getId())
                .isPresent();
        if (alreadyJoined) {
            throw new RuntimeException("Volunteer already joined");
        }

        Organisation organisation = organisationRepository.findByEmail(event.getOrganisationEmail());
        String organisationName = (organisation != null) ? organisation.getFullName() : "Unknown Organisation";


        EventVolunteer ev = new EventVolunteer();
        ev.setEvent(event);
        ev.setVolunteer(volunteer);
        ev.setOrganisationEmail(event.getOrganisationEmail());
        ev.setVolunteerEmail(volunteer.getEmail());
        ev.setJoinedAt(LocalDateTime.now());
        ev.setOrganisationName(organisationName);
        ev.setStatus(EventVolunteerStatus.ACTIVE);

        eventVolunteerRepository.save(ev);

        event.setCurrentVolunteers(event.getCurrentVolunteers() + 1);
        eventRepository.save(event);
        return Map.of(
                "currentVolunteers", event.getCurrentVolunteers(),
                "maxVolunteers", event.getMaxVolunteers()
        );
    }

    public Map<String, Integer> unjoinEvent(Long eventId, String volunteerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventVolunteer ev = eventVolunteerRepository.findByEventIdAndVolunteerEmail(eventId, volunteerEmail);
        if (ev == null) {
            throw new RuntimeException("Volunteer is not joined to this event");
        }

        eventVolunteerRepository.delete(ev);
        if (event.getCurrentVolunteers() > 0) {
            event.setCurrentVolunteers(event.getCurrentVolunteers() - 1);
            eventRepository.save(event);
        }

        return Map.of(
                "currentVolunteers", event.getCurrentVolunteers(),
                "maxVolunteers", event.getMaxVolunteers()
        );
    }


    // Metode private pentru manipulare fișiere
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

    public void deleteFromHistory(Long eventId, String volunteerEmail) {
        EventVolunteer participationRecord = eventVolunteerRepository.findByEventIdAndVolunteerEmail(eventId, volunteerEmail);

        if (participationRecord != null) {
            eventVolunteerRepository.delete(participationRecord);
        } else {
            throw new RuntimeException("Participation record not found.");
        }
    }

    public void markAsArchived(Long eventId, String volunteerEmail) {
        EventVolunteer participationRecord = eventVolunteerRepository.findByEventIdAndVolunteerEmail(eventId, volunteerEmail);

        if (participationRecord != null) {
            participationRecord.setStatus(EventVolunteerStatus.ARCHIVED);
            eventVolunteerRepository.save(participationRecord);
        } else {
            throw new RuntimeException("Participation record not found.");
        }
    }

}