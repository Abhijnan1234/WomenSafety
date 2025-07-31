package com.Hackathon.backend.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertDTO {

    @JsonProperty("id")
    private String cameraId;
    @JsonProperty("lat")
    private double latitude;
    @JsonProperty("lng")
    private double longitude;
    @JsonProperty("severity")
    private double severity;
    @JsonProperty("time")
    private String time; // Send time as string like "23:17:14" to frontend for display
    @JsonProperty("description")
    private String description; // e.g. "Group of 4 men loitering near ATM, no women in vicinity"
}

