package com.Hackathon.backend.Util;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;


    @Component
    public class SimulationClock {

        private Instant simulationRealStartTime;  // Real system time when simulation started
        private LocalTime simulationStartOffset; // Simulated clock starts at 00:00:00


        public void markStart(LocalTime firstAlertTime) {
            this.simulationRealStartTime = Instant.now();
            this.simulationStartOffset = firstAlertTime;
        }


        public int getElapsedSeconds() {
            if (simulationRealStartTime == null || simulationStartOffset == null) {
                throw new IllegalStateException("Simulation clock not started properly.");
            }
            Duration realElapsed = Duration.between(simulationRealStartTime, Instant.now());
            return (int) realElapsed.getSeconds();
        }


        public LocalTime getCurrentSimulatedTime() {
            int seconds = getElapsedSeconds();
            return simulationStartOffset.plusSeconds(seconds);
        }


    }


