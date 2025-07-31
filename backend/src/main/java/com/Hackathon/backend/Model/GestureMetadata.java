package com.Hackathon.backend.Model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name="gesture_metadata")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GestureMetadata {

    @Id

    private String gestureTag;

    private String description;
    private int aggressionScore;
    private int proximityScore;
    private int movementIntensityScore;

}



