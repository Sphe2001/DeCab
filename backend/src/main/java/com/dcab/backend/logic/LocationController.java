package com.dcab.backend.logic;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@Controller
public class LocationController {

    @MessageMapping("/location") // Incoming messages from User A
    @SendTo("/topic/location-updates") // Broadcast to User B
    public String sendLocation(String location) {
        return location; // Forward location to all subscribers
    }
}
