package com.Hackathon.backend.Service;

import com.Hackathon.backend.Model.AlertDTO;
import com.Hackathon.backend.Model.AlertRecord;
import com.Hackathon.backend.Model.GestureMetadata;
import com.Hackathon.backend.Model.GestureTag;
import com.Hackathon.backend.Repository.GestureMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AlertDispatchService {

    private final GestureMetadataRepository gestureMetadataRepository;

    @Autowired
    public AlertDispatchService(GestureMetadataRepository gestureMetadataRepository) {
        this.gestureMetadataRepository = gestureMetadataRepository;
    }

    public List<AlertDTO> toDTOs(List<AlertRecord> records) {
        List<AlertDTO> result = new ArrayList<>();

        for (AlertRecord record : records) {
            GestureTag gestureTag = record.getGestureTag();
            System.out.println("Looking up metadata for: " + gestureTag.name());

            // Fetch metadata from DB
            Optional<GestureMetadata> metadataOpt = gestureMetadataRepository.findById(gestureTag.name());

            if (metadataOpt.isEmpty()) {
                System.err.println("Warning: Metadata not found for gesture: " + gestureTag.name());
                continue; // skip this alert
            }

            GestureMetadata metadata = metadataOpt.get();

            // Calculate severity
            double severity = calculateSeverity(metadata);

            // Format time
            String formattedTime = record.getTimestamp().format(DateTimeFormatter.ofPattern("HH:mm:ss"));

            // Build DTO
            AlertDTO dto = new AlertDTO();
            dto.setCameraId(record.getCameraId());
            dto.setLatitude(record.getLatitude());
            dto.setLongitude(record.getLongitude());
            dto.setTime(formattedTime);
            dto.setSeverity(severity);
            dto.setDescription(metadata.getDescription());

            result.add(dto);
        }
        System.out.println((result.toString()));


        return result;
    }

    private double calculateSeverity(GestureMetadata metadata) {
        return 0.5 * metadata.getAggressionScore() +
                0.3 * metadata.getProximityScore() +
                0.2 * metadata.getMovementIntensityScore();
    }
    }

