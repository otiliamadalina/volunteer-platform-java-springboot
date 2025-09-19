package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.dto.ContactDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Contact;
import com.volunteer.volunteer_platform_java_springboot.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    public void saveFeedback(ContactDTO contactDTO, String userEmail) {
        Contact contact = new Contact();
        contact.setSubject(contactDTO.getSubject());
        contact.setMessage(contactDTO.getMessage());
        contact.setSenderEmail(userEmail);
        contact.setSentAt(LocalDateTime.now());
        contactRepository.save(contact);
    }
}
