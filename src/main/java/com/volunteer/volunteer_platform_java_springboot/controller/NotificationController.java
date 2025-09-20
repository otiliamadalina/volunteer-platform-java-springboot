package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.NotificationDTO;
import com.volunteer.volunteer_platform_java_springboot.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send-to-volunteer")
    public ResponseEntity<Void> sendNotificationToVolunteer(
            @RequestBody NotificationDTO notificationDTO,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        notificationService.sendNotification(notificationDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/for-volunteer")
    public ResponseEntity<List<NotificationDTO>> getNotificationsForVolunteer(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        List<NotificationDTO> notifications = notificationService.getNotificationsForVolunteer(username);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/mark-as-read/{notificationId}")
    public ResponseEntity<Void> markNotificationAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        notificationService.markAsRead(notificationId, authentication.getName());
        return ResponseEntity.ok().build();
    }


    @GetMapping("/sent-by-org")
    public ResponseEntity<List<NotificationDTO>> getSentNotifications(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String orgEmail = authentication.getName();
        List<NotificationDTO> sent = notificationService.getNotificationsSentByOrganisation(orgEmail);
        return ResponseEntity.ok(sent);
    }
}