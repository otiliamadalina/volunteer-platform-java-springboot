package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.dto.NotificationDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.Notification;
import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.EventRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.NotificationRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EventRepository eventRepository;
    private final OrganisationRepository organisationRepository;
    private final VolunteerRepository volunteerRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               EventRepository eventRepository,
                               OrganisationRepository organisationRepository,
                               VolunteerRepository volunteerRepository) {
        this.notificationRepository = notificationRepository;
        this.eventRepository = eventRepository;
        this.organisationRepository = organisationRepository;
        this.volunteerRepository = volunteerRepository;
    }

    public void sendNotification(NotificationDTO notificationDTO, String senderEmail) {
        Organisation senderOrg = organisationRepository.findByEmail(senderEmail);
        if (senderOrg == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organisation not found.");
        }

        Event event = eventRepository.findById(notificationDTO.getEventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));

        Volunteer recipientVolunteer = volunteerRepository.findById(notificationDTO.getVolunteerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Volunteer not found."));

        Notification notification = new Notification();
        notification.setEvent(event);
        notification.setVolunteer(recipientVolunteer);
        notification.setOrganisation(senderOrg);
        notification.setText(notificationDTO.getText());
        notification.setSentAt(LocalDateTime.now());
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getNotificationsForVolunteer(String username) {
        Volunteer volunteer = volunteerRepository.findByEmail(username);

        List<Notification> notifications = notificationRepository.findByVolunteerId(volunteer.getId());

        return notifications.stream().map(notification -> {
            System.out.println("Notification " + notification.getId() + " isRead: " + notification.isRead());

            NotificationDTO dto = new NotificationDTO();
            dto.setId(notification.getId());
            dto.setText(notification.getText());
            dto.setSentAt(notification.getSentAt());
            dto.setEventId(notification.getEvent().getId());
            dto.setVolunteerId(volunteer.getId());
            dto.setEventTitle(notification.getEvent().getTitle());
            dto.setOrganisationName(notification.getEvent().getOrganisationEmail());
            dto.setRead(notification.isRead());
            return dto;
        }).collect(Collectors.toList());

    }


    public void markAsRead(Long notificationId, String volunteerEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));

        if (!notification.getVolunteer().getEmail().equals(volunteerEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to notification.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getNotificationsSentByOrganisation(String orgEmail) {
        Organisation organisation = organisationRepository.findByEmail(orgEmail);
        if (organisation == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organisation not found.");
        }

        List<Notification> notifications = notificationRepository.findByOrganisationId(organisation.getId());

        return notifications.stream().map(n -> {
            NotificationDTO dto = new NotificationDTO();
            dto.setEventId(n.getEvent().getId());
            dto.setVolunteerId(n.getVolunteer().getId());
            dto.setText(n.getText());
            dto.setSentAt(n.getSentAt());
            dto.setEventTitle(n.getEvent().getTitle());
            dto.setVolunteerName(n.getVolunteer().getFullName());
            dto.setVolunteerEmail(n.getVolunteer().getEmail());
            dto.setRead(n.isRead());
            return dto;
        }).collect(Collectors.toList());
    }
}