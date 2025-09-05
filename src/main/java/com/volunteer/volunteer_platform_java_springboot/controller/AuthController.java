package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
//    @PostMapping("/registerAsVolunteer")
//    Volunteer registerVolunteer(@RequestBody Volunteer volunteer) {
//        return volunteerRepository.save(volunteer);
//    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registerAsVolunteer")
    public ResponseEntity<Volunteer> registerVolunteer(@RequestBody VolunteerDTO dto) {
        Volunteer volunteer = new Volunteer();
        volunteer.setFullName(dto.getFullName());
        volunteer.setEmail(dto.getEmail());

        // criptare parola (NU LUCREAZA)
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        volunteer.setPassword(hashedPassword);

        Volunteer savedVolunteer = volunteerRepository.save(volunteer);
        return ResponseEntity.ok(savedVolunteer);
    }



    // CREEAZA organizatie
    @PostMapping("/registerAsOrganisation")
    Organisation registerOrganisation(@RequestBody Organisation org) {
        return organisationRepository.save(org);
    }

}