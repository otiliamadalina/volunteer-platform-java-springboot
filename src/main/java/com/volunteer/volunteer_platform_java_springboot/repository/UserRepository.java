package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
