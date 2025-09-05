package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // permite accesul din frontend
public class AuthController {

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private OrganisationRepository organisationRepository;

    // CREEAZA voluntar
    @PostMapping("/registerAsVolunteer")
    Volunteer registerVolunteer(@RequestBody Volunteer volunteer) {
        return volunteerRepository.save(volunteer);
    }

    // CREEAZA organizatie
    @PostMapping("/registerAsOrganisation")
    Organisation registerOrganisation(@RequestBody Organisation org) {
        return organisationRepository.save(org);
    }

}