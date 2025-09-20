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

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

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
}
