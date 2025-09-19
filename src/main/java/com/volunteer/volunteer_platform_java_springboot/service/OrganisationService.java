package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganisationService {

    private final OrganisationRepository organisationRepository;

    @Autowired
    public OrganisationService(OrganisationRepository organisationRepository) {
        this.organisationRepository = organisationRepository;
    }

    public List<Organisation> findAllOrganisations() {
        return organisationRepository.findAll();
    }
}
