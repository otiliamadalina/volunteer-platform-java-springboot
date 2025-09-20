package com.volunteer.volunteer_platform_java_springboot.dto;

import java.time.LocalDateTime;

public class SimpleRegistrationDTO {
    private String role; // VOLUNTEER or ORGANISATION
    private String name;
    private String email;
    private LocalDateTime createdAt;

    public SimpleRegistrationDTO() {}

    public SimpleRegistrationDTO(String role, String name, String email, LocalDateTime createdAt) {
        this.role = role;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
