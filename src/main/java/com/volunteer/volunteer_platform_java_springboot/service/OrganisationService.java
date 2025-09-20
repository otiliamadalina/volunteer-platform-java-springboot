package com.volunteer.volunteer_platform_java_springboot.service;

import com.volunteer.volunteer_platform_java_springboot.dto.EventDTO;
import com.volunteer.volunteer_platform_java_springboot.dto.VolunteerDTO;
import com.volunteer.volunteer_platform_java_springboot.model.Event;
import com.volunteer.volunteer_platform_java_springboot.model.EventVolunteer;
import com.volunteer.volunteer_platform_java_springboot.model.Organisation;
import com.volunteer.volunteer_platform_java_springboot.repository.EventVolunteerRepository;
import com.volunteer.volunteer_platform_java_springboot.repository.OrganisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrganisationService {

    private final OrganisationRepository organisationRepository;
    @Autowired
    private EventVolunteerRepository eventVolunteerRepository;

    @Autowired
    public OrganisationService(OrganisationRepository organisationRepository) {
        this.organisationRepository = organisationRepository;
    }

    public List<Organisation> findAllOrganisations() {
        return organisationRepository.findAll();
    }



    public List<EventDTO> getEventsWithVolunteers(String organisationEmail) {
        Organisation organisation = organisationRepository.findByEmail(organisationEmail);

        List<EventVolunteer> eventVolunteers = eventVolunteerRepository.findByOrganisationEmail(organisationEmail);

        Map<Event, List<EventVolunteer>> eventsMap = eventVolunteers.stream()
                .collect(Collectors.groupingBy(EventVolunteer::getEvent));

        List<EventDTO> eventDTOs = new ArrayList<>();
        eventsMap.forEach((event, relationships) -> {
            EventDTO eventDTO = new EventDTO();
            eventDTO.setId(event.getId());
            eventDTO.setTitle(event.getTitle());
            eventDTO.setLocation(event.getLocation());

            List<VolunteerDTO> volunteerDTOs = relationships.stream()
                    .map(relationship -> {
                        VolunteerDTO volunteerDTO = new VolunteerDTO();
                        volunteerDTO.setId(relationship.getVolunteer().getId());
                        volunteerDTO.setFullName(relationship.getVolunteer().getFullName());
                        volunteerDTO.setEmail(relationship.getVolunteer().getEmail());
                        return volunteerDTO;
                    })
                    .collect(Collectors.toList());

            eventDTO.setVolunteers(volunteerDTOs);
            eventDTOs.add(eventDTO);
        });

        return eventDTOs;
    }

}
