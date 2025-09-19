package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
}
