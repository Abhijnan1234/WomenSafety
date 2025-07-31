package com.Hackathon.backend.MyConfig;

import com.Hackathon.backend.Model.GestureMetadata;
import com.Hackathon.backend.Repository.GestureMetadataRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

    @Configuration
    public class DataInitializer {

        @Bean
        public CommandLineRunner initData(GestureMetadataRepository repo) {
            return args -> {
                repo.saveAll(List.of(
                        new GestureMetadata("RAISED_HAND", "Hand raised in an aggressive motion, possibly to strike.", 8, 7, 6),
                        new GestureMetadata("PUSHING", "Physical shoving or pushing of another person.", 9, 8, 6),
                        new GestureMetadata("PUNCHING", "Closed-fist striking action.", 10, 9, 9),
                        new GestureMetadata("SLAPPING", "Open-hand slap directed at someone.", 9, 9, 7),
                        new GestureMetadata("GRABBING", "Grabbing or restraining action.", 8, 9, 5),
                        new GestureMetadata("CHASING", "Running after a person aggressively.", 7, 6, 10),
                        new GestureMetadata("BLOCKING_WAY", "Physically obstructing someone’s movement.", 7, 8, 4),
                        new GestureMetadata("INTIMIDATING_POSTURE", "Threatening body language close to a person.", 8, 9, 3),

                        new GestureMetadata("STARING", "Prolonged, uncomfortable staring.", 5, 8, 1),
                        new GestureMetadata("LOITERING", "Remaining in area without reason.", 3, 6, 2),
                        new GestureMetadata("FOLLOWING", "Trailing someone for a suspicious period.", 6, 8, 4),
                        new GestureMetadata("HOVERING", "Standing very close without contact.", 4, 9, 2),
                        new GestureMetadata("POINTING", "Directing attention with finger in a forceful manner.", 5, 5, 2),

                        new GestureMetadata("WAVING_FOR_HELP", "Arm waving to signal for help.", 0, 7, 6),
                        new GestureMetadata("HANDS_UP", "Both hands raised in submission or to get attention.", 1, 6, 3),
                        new GestureMetadata("CALLING_PHONE", "Gesture suggesting calling someone.", 0, 5, 1),
                        new GestureMetadata("RUNNING_AWAY", "Person fleeing rapidly from danger.", 0, 9, 9),
                        new GestureMetadata("FALLING", "Unexpected fall indicating distress or accident.", 0, 6, 7),
                        new GestureMetadata("HAND_SIGNAL_SOS", "Recognized hand signal for domestic abuse or help.", 0, 10, 3),

                        new GestureMetadata("WALKING", "Normal walking.", 0, 3, 2),
                        new GestureMetadata("STANDING", "Neutral posture, standing.", 0, 2, 1),
                        new GestureMetadata("SITTING", "Seated posture.", 0, 1, 0),
                        new GestureMetadata("TALKING", "Conversational gestures.", 1, 3, 2),
                        new GestureMetadata("GESTURING_CASUALLY", "Non-aggressive hand motion.", 1, 3, 2)
                ));
            };
        }
    }


