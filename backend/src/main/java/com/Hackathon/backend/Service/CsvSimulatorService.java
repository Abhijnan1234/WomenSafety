package com.Hackathon.backend.Service;


import com.Hackathon.backend.Model.AlertRecord;

import com.Hackathon.backend.Util.CsvReader;
import com.Hackathon.backend.Util.SimulationClock;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvSimulatorService {

    private final SimulationClock simulationClock;
    private final CsvReader csvReader;

    private List<AlertRecord> alertTimeline;

    @Value("${app.csv.path}")
    private String csvPath;

    public CsvSimulatorService(SimulationClock simulationClock, CsvReader csvReader) {
        this.simulationClock = simulationClock;
        this.csvReader = csvReader;
    }
    private boolean initialized = false;
    private synchronized void initializeIfNeeded() {
        if (!initialized) {
            this.alertTimeline = csvReader.readAlerts(csvPath);
            this.alertTimeline.sort(Comparator.comparing(AlertRecord::getTimestamp));
            LocalTime firstAlertTime = alertTimeline.getFirst().getTimestamp();
            simulationClock.markStart(firstAlertTime);
            initialized = true;
            System.out.println("Simulation started at real-time: " + Instant.now());
        }
    }

    /**
     * Called every 2 seconds to get alerts that match the current simulation time
     */
    public List<AlertRecord> getCurrentAlerts() {
        initializeIfNeeded();
        LocalTime simulatedNow = simulationClock.getCurrentSimulatedTime();

        System.out.println(alertTimeline.toString());
        return alertTimeline.stream()
                .filter(record -> {

                                LocalTime alertTime = record.getTimestamp();
                                return !alertTime.isBefore(simulatedNow) &&
                                        alertTime.isBefore(simulatedNow.plusSeconds(2));

                })
                .collect(Collectors.toList());
    }
}