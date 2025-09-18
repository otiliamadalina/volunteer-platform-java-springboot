package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import com.volunteer.volunteer_platform_java_springboot.service.VolunteerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/admin")
public class AdminController {
    private final VolunteerService volunteerService;
    private final OrganisationRepository organisationRepository;

    public AdminController(VolunteerService volunteerService, OrganisationRepository organisationRepository) {
        this.volunteerService = volunteerService;
        this.organisationRepository = organisationRepository;
    }

    @GetMapping("/manageVolunteers")
    public List<Volunteer> getVolunteers() {
        return volunteerService.getAllVolunteers();
    }


    @DeleteMapping("/manageVolunteers/{id}")
    public void deleteVolunteer(@PathVariable Long id) {
        volunteerService.deleteVolunteer(id);
    }

    @DeleteMapping("/organisations/{id}")
    public ResponseEntity<Void> deleteOrganisation(@PathVariable Long id) {
        if (!organisationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        organisationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
