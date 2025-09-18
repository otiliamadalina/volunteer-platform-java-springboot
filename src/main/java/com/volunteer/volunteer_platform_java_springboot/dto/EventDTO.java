package com.volunteer.volunteer_platform_java_springboot.dto;

import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;

import java.time.LocalDateTime;

public class EventDTO {
    private String title;
    private String description;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxVolunteers;
    private String organisationEmail;
    private String imageUrl;
    private EventStatus status;
    private int currentVolunteers;
    private LocalDateTime createdAt;

    // Constructors
    public EventDTO() {}

    public EventDTO(String title, String description, String location,
                    LocalDateTime startDate, LocalDateTime endDate,
                    Integer maxVolunteers, String organisationEmail, String imageUrl) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxVolunteers = maxVolunteers;
        this.organisationEmail = organisationEmail;
        this.imageUrl = imageUrl;

    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getMaxVolunteers() {
        return maxVolunteers;
    }

    public void setMaxVolunteers(Integer maxVolunteers) {
        this.maxVolunteers = maxVolunteers;
    }

    public String getOrganisationEmail() {
        return organisationEmail;
    }

    public void setOrganisationEmail(String organisationEmail) {
        this.organisationEmail = organisationEmail;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    private Long id;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public EventStatus getStatus() {
        return status;
    }
    public void setStatus(EventStatus status) {
        this.status = status;
    }
    public Integer getCurrentVolunteers() {
        return currentVolunteers;
    }
    public void setCurrentVolunteers(Integer currentVolunteers) {
        this.currentVolunteers = currentVolunteers;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }



}