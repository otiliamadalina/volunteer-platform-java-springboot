package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByEmail(String email);
}
