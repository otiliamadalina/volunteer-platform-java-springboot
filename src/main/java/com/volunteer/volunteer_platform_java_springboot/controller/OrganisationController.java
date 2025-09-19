package com.volunteer.volunteer_platform_java_springboot.controller;

import com.volunteer.volunteer_platform_java_springboot.dto.OrganisationDTO;
import com.volunteer.volunteer_platform_java_springboot.service.OrganisationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orgs")
public class OrganisationController {

    private final OrganisationService organisationService;

    @Autowired
    public OrganisationController(OrganisationService organisationService) {
        this.organisationService = organisationService;
    }

    @GetMapping
    public ResponseEntity<List<OrganisationDTO>> getAllOrganisations() {
        List<OrganisationDTO> organisations = organisationService.findAllOrganisations().stream()
                .map(org -> {
                    OrganisationDTO dto = new OrganisationDTO();
                    dto.setFullName(org.getFullName());
                    dto.setEmail(org.getEmail());
                    dto.setLocation(org.getLocation());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(organisations);
    }
}
