package com.Hackathon.backend.MyController;

import com.Hackathon.backend.Model.AlertDTO;
import com.Hackathon.backend.Model.AlertRecord;
import com.Hackathon.backend.Service.AlertDispatchService;
import com.Hackathon.backend.Service.CsvSimulatorService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
@CrossOrigin(origins = "*")

@RestController
    @RequestMapping("/api/alerts")
    public class MyAlertController {

        private final CsvSimulatorService csvSimulatorService;
        private final AlertDispatchService alertDispatchService;

        @Autowired
        public MyAlertController(CsvSimulatorService csvSimulatorService, AlertDispatchService alertDispatchService) {
            this.csvSimulatorService = csvSimulatorService;
            this.alertDispatchService = alertDispatchService;
        }

        @GetMapping("/live")
        public List<AlertDTO> getLiveAlerts() {
            List<AlertRecord> currentAlerts = csvSimulatorService.getCurrentAlerts();
            System.out.println((currentAlerts.toString()));
            return alertDispatchService.toDTOs(currentAlerts);
        }
    }
