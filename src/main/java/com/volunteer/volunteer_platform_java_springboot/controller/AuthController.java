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
import com.volunteer.volunteer_platform_java_springboot.service.VolunteerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.session.FindByIndexNameSessionRepository;

import java.security.Principal;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // permite accesul din frontend
@RequestMapping("/api")
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
    public ResponseEntity<?> registerVolunteer(@RequestBody VolunteerDTO dto, HttpServletRequest request) {
        // Create and save the new volunteer account
        Volunteer volunteer = new Volunteer();
        volunteer.setFullName(dto.getFullName());
        volunteer.setEmail(dto.getEmail());
        volunteer.setRole(UserRole.VOLUNTEER);

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        volunteer.setPassword(hashedPassword);
        System.out.println("Encoded password: " + hashedPassword);

        Volunteer savedVolunteer = volunteerRepository.save(volunteer);

        // Aici este logica de creare a sesiunii, exact ca la login.
        org.springframework.security.core.Authentication authentication =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        savedVolunteer.getEmail(), null,
                        java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(savedVolunteer.getRole().name()))
                );
        org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        org.springframework.security.core.context.SecurityContextHolder.setContext(context);
        jakarta.servlet.http.HttpSession session = request.getSession(true);
        session.setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, savedVolunteer.getEmail());
        request.changeSessionId();
        session.setAttribute("userRole", savedVolunteer.getRole().name());
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, savedVolunteer.getEmail());

        return ResponseEntity.ok(Map.of(
                "role", savedVolunteer.getRole().name(),
                "id", savedVolunteer.getId(),
                "fullName", savedVolunteer.getFullName(),
                "email", savedVolunteer.getEmail()
        ));
    }

    @PostMapping("/registerAsOrganisation")
    public ResponseEntity<?> registerOrganisation(@RequestBody OrganisationDTO dto, jakarta.servlet.http.HttpServletRequest request) {
        Organisation organisation = new Organisation();
        organisation.setFullName(dto.getFullName());
        organisation.setEmail(dto.getEmail());
        organisation.setContactNumber(dto.getContactNumber());
        organisation.setLocation(dto.getLocation());
        organisation.setRole(UserRole.ORGANISATION);

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        organisation.setPassword(hashedPassword);

        Organisation savedOrganisation = organisationRepository.save(organisation);

        org.springframework.security.core.Authentication authentication =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        savedOrganisation.getEmail(), null,
                        java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(savedOrganisation.getRole().name()))
                );
        org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        org.springframework.security.core.context.SecurityContextHolder.setContext(context);
        jakarta.servlet.http.HttpSession session = request.getSession(true);
        session.setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        session.setAttribute(org.springframework.session.FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, savedOrganisation.getEmail());
        request.changeSessionId();
        session.setAttribute("userRole", savedOrganisation.getRole().name());
        session.setAttribute(org.springframework.session.FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, savedOrganisation.getEmail());

        return ResponseEntity.ok(java.util.Map.of(
                "role", savedOrganisation.getRole().name(),
                "id", savedOrganisation.getId(),
                "fullName", savedOrganisation.getFullName(),
                "email", savedOrganisation.getEmail()
        ));
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
                jakarta.servlet.http.HttpSession session = request.getSession(true);
                session.setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
                session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, volunteer.getEmail());
                request.changeSessionId();
                session.setAttribute("userRole", volunteer.getRole().name());
                // ensure principal is always indexed
                session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, volunteer.getEmail());

                System.out.println("Session ID: " + session.getId());
                System.out.println("Set principal: " + volunteer.getEmail());
                System.out.println("Set role: " + volunteer.getRole().name());


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
                jakarta.servlet.http.HttpSession session = request.getSession(true);
                session.setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
                session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, organisation.getEmail());
                request.changeSessionId();
                session.setAttribute("userRole", organisation.getRole().name());
                session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, organisation.getEmail());

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
                jakarta.servlet.http.HttpSession session = request.getSession(true);
                session.setAttribute(org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
                session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, admin.getEmail());
                request.changeSessionId();
                session.setAttribute("userRole", admin.getRole().name());
                session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, admin.getEmail());

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

    @GetMapping("/admin/volunteers")
    public ResponseEntity<?> getAllVolunteers() {
        try {
            java.util.List<Volunteer> volunteers = volunteerRepository.findAll();
            System.out.println("Found " + volunteers.size() + " volunteers in database");
            for (Volunteer v : volunteers) {
                System.out.println("Volunteer: " + v.getId() + " - " + v.getFullName() + " - " + v.getEmail());
            }
            return ResponseEntity.ok(volunteers);
        } catch (Exception e) {
            System.out.println("Error fetching volunteers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching volunteers: " + e.getMessage());
        }
    }

    @GetMapping("/admin/organisations")
    public ResponseEntity<?> getAllOrganisations() {
        try {
            java.util.List<Organisation> organisations = organisationRepository.findAll();
            System.out.println("Found " + organisations.size() + " organisations in database");
            for (Organisation o : organisations) {
                System.out.println("Organisation: " + o.getId() + " - " + o.getFullName() + " - " + o.getEmail());
            }
            return ResponseEntity.ok(organisations);
        } catch (Exception e) {
            System.out.println("Error fetching organisations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching organisations: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }

}