package com.Hackathon.backend.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertRecord {

    @JsonProperty("timestamp")
    private LocalTime timestamp;
    @JsonProperty("cameraId")
    private String cameraId;
    @JsonProperty("latitude")
    private double latitude;
    @JsonProperty("longitude")
    private double longitude;
    @JsonProperty("gestureTag")
    private GestureTag gestureTag;


}

