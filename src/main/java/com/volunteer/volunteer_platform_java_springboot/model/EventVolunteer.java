// src/main/java/com/volunteer/volunteer_platform_java_springboot/model/EventVolunteer.java

package com.volunteer.volunteer_platform_java_springboot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_volunteer")
public class EventVolunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    @Column(name = "organisation_email", nullable = false)
    private String organisationEmail;

    @Column(name = "volunteer_email", nullable = false)
    private String volunteerEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EventVolunteerStatus status;

    private LocalDateTime joinedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public String getOrganisationEmail() {
        return organisationEmail;
    }

    public void setOrganisationEmail(String organisationEmail) {
        this.organisationEmail = organisationEmail;
    }

    public String getVolunteerEmail() {
        return volunteerEmail;
    }

    public void setVolunteerEmail(String volunteerEmail) {
        this.volunteerEmail = volunteerEmail;
    }

    public EventVolunteerStatus getStatus() {
        return status;
    }

    public void setStatus(EventVolunteerStatus status) {
        this.status = status;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}