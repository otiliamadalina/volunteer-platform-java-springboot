package com.volunteer.volunteer_platform_java_springboot.dto;

import com.volunteer.volunteer_platform_java_springboot.model.EventStatus;
import java.time.LocalDateTime;
import java.util.List;

public class StatisticsDTO {
    private long totalVolunteers;
    private long totalOrganisations;
    private long totalEvents;
    private long publishedEvents;
    private long completedEvents;
    private List<EventSummary> recentEvents;

    public long getTotalVolunteers() { return totalVolunteers; }
    public void setTotalVolunteers(long totalVolunteers) { this.totalVolunteers = totalVolunteers; }

    public long getTotalOrganisations() { return totalOrganisations; }
    public void setTotalOrganisations(long totalOrganisations) { this.totalOrganisations = totalOrganisations; }

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getPublishedEvents() { return publishedEvents; }
    public void setPublishedEvents(long publishedEvents) { this.publishedEvents = publishedEvents; }

    public long getCompletedEvents() { return completedEvents; }
    public void setCompletedEvents(long completedEvents) { this.completedEvents = completedEvents; }

    public List<EventSummary> getRecentEvents() { return recentEvents; }
    public void setRecentEvents(List<EventSummary> recentEvents) { this.recentEvents = recentEvents; }

    public static class EventSummary {
        private Long id;
        private String title;
        private String location;
        private LocalDateTime startDate;
        private EventStatus status;

        public EventSummary() {}
        public EventSummary(Long id, String title, String location, LocalDateTime startDate, EventStatus status) {
            this.id = id; this.title = title; this.location = location; this.startDate = startDate; this.status = status;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public LocalDateTime getStartDate() { return startDate; }
        public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
        public EventStatus getStatus() { return status; }
        public void setStatus(EventStatus status) { this.status = status; }
    }
}
