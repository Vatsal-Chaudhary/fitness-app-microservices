package com.fitness.aiservice.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collation = "activities")
public class Activity {
    private String id;
    private String userId;
    private Integer duration;
    private ActivityType Type;
    private Integer caloriesBurned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, Object> additionalMetrics;
}
