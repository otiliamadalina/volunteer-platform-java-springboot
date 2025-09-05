package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VolunteerRepository extends JpaRepository<Volunteer,Long> {

    Volunteer findByEmail(String email);
}
