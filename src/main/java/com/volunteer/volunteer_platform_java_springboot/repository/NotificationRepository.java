package com.volunteer.volunteer_platform_java_springboot.repository;

import com.volunteer.volunteer_platform_java_springboot.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByVolunteerIdOrderBySentAtDesc(Long volunteerId);

    @Query("SELECT n FROM Notification n WHERE n.volunteer.id = :volunteerId")
    List<Notification> findByVolunteerId(@Param("volunteerId") Long volunteerId);
    List<Notification> findByOrganisationId(Long organisationId);


}
