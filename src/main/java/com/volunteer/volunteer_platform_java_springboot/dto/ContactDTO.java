package com.volunteer.volunteer_platform_java_springboot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactDTO {
    @NotBlank
    @Size(max = 100)
    private String subject;

    @NotBlank
    @Size(max = 500)
    private String message;

    // Getters and Setters
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
