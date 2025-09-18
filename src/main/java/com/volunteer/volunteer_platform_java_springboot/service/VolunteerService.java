package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.UserRole;
import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VolunteerService {


    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;

    public VolunteerService(VolunteerRepository volunteerRepository, PasswordEncoder passwordEncoder) {
        this.volunteerRepository = volunteerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public VolunteerDTO registerVolunteer(VolunteerDTO dto) {
        Volunteer volunteer = new Volunteer();
        volunteer.setFullName(dto.getFullName());
        volunteer.setEmail(dto.getEmail());
        volunteer.setRole(UserRole.VOLUNTEER);

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        volunteer.setPassword(hashedPassword);

        Volunteer saved = volunteerRepository.save(volunteer);

        VolunteerDTO response = new VolunteerDTO();
        response.setFullName(saved.getFullName());
        response.setEmail(saved.getEmail());
        return response;
    }

    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    public void deleteVolunteer(Long id) {
        volunteerRepository.deleteById(id);
    }


}

