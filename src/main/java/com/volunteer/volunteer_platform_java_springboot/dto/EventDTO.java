package com.volunteer.volunteer_platform_java_springboot.dto;

import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import java.time.LocalDateTime;
import java.util.List;

public class EventDTO {
    private Long id;

    @NotBlank(message = "Title is required.")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters.")
    private String title;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotBlank(message = "Location is required.")
    private String location;

    @NotNull(message = "Start date is required.")
    @FutureOrPresent(message = "Start date must be in the future or present.")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required.")
    private LocalDateTime endDate;

    @NotNull(message = "Maximum volunteers is required.")
    @Min(value = 1, message = "There must be at least 1 volunteer.")
    private Integer maxVolunteers;

    @NotBlank(message = "Organisation email is required.")
    @Email(message = "Invalid email format.")
    private String organisationEmail;

    @URL(message = "Invalid URL format for image.")
    private String imageUrl;

    // These fields are managed by the backend
    private EventStatus status;
    private int currentVolunteers;
    private LocalDateTime createdAt;
    private String organisationName;

    private List<VolunteerDTO> volunteers;

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
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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

    public String getOrganisationName() {
        return organisationName;
    }

    public void setOrganisationName(String organisationName) {
        this.organisationName = organisationName;
    }

    // Getter and setter for the volunteers list
    public List<VolunteerDTO> getVolunteers() {
        return volunteers;
    }

    public void setVolunteers(List<VolunteerDTO> volunteers) {
        this.volunteers = volunteers;
    }
}
