package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.LoginDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.OrganisationDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Admin;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.repository.AdminRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import jakarta.annotation.PostConstruct;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminRepository adminRepository;

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

    @PostMapping("/registerAsOrganisation")
    public ResponseEntity<Organisation> registerOrganisation(@RequestBody OrganisationDTO dto) {
        Organisation organisation = new Organisation();
        organisation.setFullName(dto.getFullName());
        organisation.setEmail(dto.getEmail());
        organisation.setContactNumber(dto.getContactNumber());
        organisation.setLocation(dto.getLocation());

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        organisation.setPassword(hashedPassword);
        System.out.println("Encoded password: " + hashedPassword);

        Organisation savedOrganisation = organisationRepository.save(organisation);
        return ResponseEntity.ok(savedOrganisation);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        System.out.println("Login attempt for: " + loginDTO.getEmail());

        Volunteer volunteer = volunteerRepository.findByEmail(loginDTO.getEmail());
        if (volunteer != null) {
            boolean match = passwordEncoder.matches(loginDTO.getPassword(), volunteer.getPassword());
            System.out.println("Volunteer match: " + match);

            if (match) {
                volunteer.setPassword(null); // ascundem parola
                System.out.println("Volunteer fullName: " + volunteer.getFullName());
                return ResponseEntity.ok(Map.of( // backend-uul trimite numele voluntarului la frontend
                        "role", "volunteer",
                        "id", volunteer.getId(),
                        "fullName", volunteer.getFullName(),
                        "email", volunteer.getEmail()
                ));
            }
        }

        Organisation organisation = organisationRepository.findByEmail(loginDTO.getEmail());
        if (organisation != null) {
            boolean match = passwordEncoder.matches(loginDTO.getPassword(), organisation.getPassword());
            System.out.println("Organisation match: " + match);

            if (match) {
                organisation.setPassword(null); // ascundem parola
                return ResponseEntity.ok(Map.of(
                        "role", "organisation",
                        "id", organisation.getId(),
                        "fullName", organisation.getFullName(),
                        "email", organisation.getEmail()
                ));
            }
        }

        Admin admin = adminRepository.findByEmail(loginDTO.getEmail());
        if (admin != null) {
            boolean match = passwordEncoder.matches(loginDTO.getPassword(), admin.getPassword());
            System.out.println("Admin match: " + match);

            if (match) {
                admin.setPassword(null); // ascundem parola
                System.out.println("Admin fullName: " + admin.getFullName());
                return ResponseEntity.ok(Map.of(
                        "role", "admin",
                        "id", admin.getId(),
                        "fullName", admin.getFullName(),
                        "email", admin.getEmail()
                ));
            }
        }


        System.out.println("Login failed for: " + loginDTO.getEmail());
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @GetMapping("/generateAdminPassword")
    public ResponseEntity<String> generateAdminPassword() {
        String rawPassword = "admin1234";
        String hashed = passwordEncoder.encode(rawPassword);
        return ResponseEntity.ok("Hash-ul parolei: " + hashed);
    }

}