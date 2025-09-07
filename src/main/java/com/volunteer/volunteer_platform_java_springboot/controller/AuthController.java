package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.LoginDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        volunteer.setPassword(hashedPassword);
        System.out.println("Encoded password: " + hashedPassword);

        Volunteer savedVolunteer = volunteerRepository.save(volunteer);
        return ResponseEntity.ok(savedVolunteer);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        System.out.println("Login attempt for: " + loginDTO.getEmail());

        Volunteer volunteer = volunteerRepository.findByEmail(loginDTO.getEmail());
        if (volunteer != null) {
            boolean match = passwordEncoder.matches(loginDTO.getPassword(), volunteer.getPassword());
            System.out.println("Volunteer match: " + match);

            if (match) {
                return ResponseEntity.ok(Map.of(
                        "role", "volunteer",
                        "id", volunteer.getId(),
                        "message", "Login successful"
                ));
            }
        }

        Organisation organisation = organisationRepository.findByEmail(loginDTO.getEmail());
        if (organisation != null) {
            boolean match = passwordEncoder.matches(loginDTO.getPassword(), organisation.getPassword());
            System.out.println("Organisation match: " + match);

            if (match) {
                return ResponseEntity.ok(Map.of(
                        "role", "organisation",
                        "id", organisation.getId(),
                        "message", "Login successful"
                ));
            }
        }

        System.out.println("Login failed for: " + loginDTO.getEmail());
        return ResponseEntity.status(401).body("Invalid email or password");
    }






    // CREEAZA organizatie
    @PostMapping("/registerAsOrganisation")
    Organisation registerOrganisation(@RequestBody Organisation org) {
        return organisationRepository.save(org);
    }

}