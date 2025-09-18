package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<VolunteerDTO> getVolunteerProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String volunteerEmail = authentication.getName();

        Volunteer volunteer = volunteerRepository.findByEmail(volunteerEmail);

        if (volunteer != null) {
            VolunteerDTO dto = new VolunteerDTO();
            dto.setFullName(volunteer.getFullName());
            dto.setEmail(volunteer.getEmail());
            dto.setPassword(null);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateVolunteerProfile(@RequestBody VolunteerDTO volunteerDto) {
        System.out.println("Received PUT request to update profile."); 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String volunteerEmail = authentication.getName();

        Volunteer volunteer = volunteerRepository.findByEmail(volunteerEmail);

        if (volunteer != null) {
            volunteer.setFullName(volunteerDto.getFullName());

            if (!volunteerEmail.equals(volunteerDto.getEmail()) && volunteerRepository.findByEmail(volunteerDto.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Email is already in use.");
            }
            volunteer.setEmail(volunteerDto.getEmail());

            if (volunteerDto.getPassword() != null && !volunteerDto.getPassword().isEmpty()) {
                volunteer.setPassword(passwordEncoder.encode(volunteerDto.getPassword()));
            }

            volunteerRepository.save(volunteer);
            return ResponseEntity.ok().body("Profile updated successfully!");
        } else {
            return ResponseEntity.status(401).body("Volunteer not found. Check authentication and database data.");
        }
    }
}
