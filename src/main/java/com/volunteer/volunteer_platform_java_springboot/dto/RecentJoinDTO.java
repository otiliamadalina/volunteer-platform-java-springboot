package com.volunteer.volunteer_platform_java_springboot.dto;

import java.time.LocalDateTime;

public class RecentJoinDTO {
    private String eventTitle;
    private String volunteerName;
    private String volunteerEmail;
    private String organisationName;
    private LocalDateTime joinedAt;

    public RecentJoinDTO() {}

    public RecentJoinDTO(String eventTitle, String volunteerName, String volunteerEmail, String organisationName, LocalDateTime joinedAt) {
        this.eventTitle = eventTitle;
        this.volunteerName = volunteerName;
        this.volunteerEmail = volunteerEmail;
        this.organisationName = organisationName;
        this.joinedAt = joinedAt;
    }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }

    public String getVolunteerEmail() { return volunteerEmail; }
    public void setVolunteerEmail(String volunteerEmail) { this.volunteerEmail = volunteerEmail; }

    public String getOrganisationName() { return organisationName; }
    public void setOrganisationName(String organisationName) { this.organisationName = organisationName; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
