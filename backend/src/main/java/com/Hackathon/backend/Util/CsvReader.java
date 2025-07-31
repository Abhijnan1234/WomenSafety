

        package com.Hackathon.backend.Util;

import com.Hackathon.backend.Model.AlertRecord;
import com.Hackathon.backend.Model.GestureTag;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.*;
import java.time.LocalTime;
import java.util.*;

        @Component
        public class CsvReader {

            public List<AlertRecord> readAlerts(String csvFilePath) {
                List<AlertRecord> records = new ArrayList<>();

                try (BufferedReader br = Files.newBufferedReader(Paths.get(csvFilePath))) {
                    String line;

                    while ((line = br.readLine()) != null) {
                        String[] parts = line.split(",");

                        if (parts.length < 5) {
                            // Skip malformed lines
                            continue;
                        }

                        try {
                            // Parse fields
                            LocalTime timestamp = LocalTime.parse(parts[0].trim());
                            String cameraId = parts[1].trim();
                            double latitude = Double.parseDouble(parts[2].trim());
                            double longitude = Double.parseDouble(parts[3].trim());
                            GestureTag gestureTag = GestureTag.valueOf(parts[4].trim().toUpperCase());

                            // Construct AlertRecord using builder
                            AlertRecord record = AlertRecord.builder()
                                    .timestamp(timestamp)
                                    .cameraId(cameraId)
                                    .latitude(latitude)
                                    .longitude(longitude)
                                    .gestureTag(gestureTag)
                                    .build();

                            records.add(record);
                        } catch (Exception e) {
                            System.err.println("Failed to parse line: " + line);
                            e.printStackTrace();
                        }
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }

                return records;
            }
        }




