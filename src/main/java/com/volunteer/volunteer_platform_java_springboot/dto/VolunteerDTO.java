package com.volunteer.volunteer_platform_java_springboot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VolunteerDTO {

    @NotBlank(message = "Full name is required.")
    @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters.")
    private String fullName;

    @NotBlank(message = "Email address is required.")
    @Email(message = "The email address is not valid.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 5, message = "Password must be at least 5 characters long.")
    private String password;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
