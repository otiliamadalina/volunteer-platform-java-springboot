package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.LoginDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.OrganisationDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Admin;
import com.volunteer.volunteer_platform_java_springboot.model.UserRole;
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

import java.security.Principal;
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
        volunteer.setRole(UserRole.VOLUNTEER);

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
        organisation.setRole(UserRole.ORGANISATION);

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        organisation.setPassword(hashedPassword);
        System.out.println("Encoded password: " + hashedPassword);

        Organisation savedOrganisation = organisationRepository.save(organisation);
        return ResponseEntity.ok(savedOrganisation);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, jakarta.servlet.http.HttpServletRequest request) {
        System.out.println("Login attempt for: " + loginDTO.getEmail());

        Volunteer volunteer = volunteerRepository.findByEmail(loginDTO.getEmail());
        if (volunteer != null) {
            boolean match = passwordEncoder.matches(loginDTO.getPassword(), volunteer.getPassword());
            System.out.println("Volunteer match: " + match);

            if (match) {
                // setam session autentif cu rolul utilizatorului
                org.springframework.security.core.Authentication authentication =
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                volunteer.getEmail(), null,
                                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(volunteer.getRole().name()))
                        );
                org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                org.springframework.security.core.context.SecurityContextHolder.setContext(context);
                request.getSession(true).setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

                return ResponseEntity.ok(Map.of(
                        "role", volunteer.getRole().name(),
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
                org.springframework.security.core.Authentication authentication =
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                organisation.getEmail(), null,
                                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(organisation.getRole().name()))
                        );
                org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                org.springframework.security.core.context.SecurityContextHolder.setContext(context);
                request.getSession(true).setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

                return ResponseEntity.ok(Map.of(
                        "role", organisation.getRole().name(),
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
                org.springframework.security.core.Authentication authentication =
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                admin.getEmail(), null,
                                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(admin.getRole().name()))
                        );
                org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                org.springframework.security.core.context.SecurityContextHolder.setContext(context);
                request.getSession(true).setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

                return ResponseEntity.ok(Map.of(
                        "role", admin.getRole().name(),
                        "id", admin.getId(),
                        "fullName", admin.getFullName(),
                        "email", admin.getEmail()
                ));
            }
        }

        System.out.println("Login failed for: " + loginDTO.getEmail());
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @GetMapping("/organisation/test")
    public ResponseEntity<String> organisationAccess() {
        return ResponseEntity.ok("Access granted to ORGANISATION");
    }

    @GetMapping("/admin/test")
    public ResponseEntity<String> adminAccess() {
        return ResponseEntity.ok("Access granted to ADMIN");
    }

    @GetMapping("/volunteer/test")
    public ResponseEntity<String> volunteerAccess(Principal principal) {
        String email = principal.getName();
        Volunteer v = volunteerRepository.findByEmail(email);
        if (v != null && v.getRole() == UserRole.VOLUNTEER) {
            return ResponseEntity.ok("Access granted");
        }
        return ResponseEntity.status(403).body("Access denied");
    }


    @GetMapping("/generateAdminPassword")
    public ResponseEntity<String> generateAdminPassword() {
        String rawPassword = "admin1234";
        String hashed = passwordEncoder.encode(rawPassword);
        return ResponseEntity.ok("Hash-ul parolei: " + hashed);
    }

}