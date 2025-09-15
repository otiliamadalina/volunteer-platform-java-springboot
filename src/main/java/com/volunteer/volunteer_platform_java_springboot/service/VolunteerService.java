package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import com.volunteer.volunteer_platform_java_springboot.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    public void deleteVolunteer(Long id) {
        volunteerRepository.deleteById(id);
    }
}

