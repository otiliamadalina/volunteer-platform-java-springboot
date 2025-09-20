package com.volunteer.volunteer_platform_java_springboot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class OrganisationDTO {
    @NotBlank(message = "Organisation name is required.")
    private String fullName;

    @NotBlank(message = "Email address is required.")
    @Email(message = "The email address is not valid.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 5, message = "Password must be at least 5 characters long.")
    private String password;

    @NotBlank(message = "Contact number is required.")
    @Pattern(regexp = "\\d{9}", message = "Contact number must contain 9 digits.")
    private String contactNumber;

    @NotBlank(message = "Location is required.")
    private String location;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
