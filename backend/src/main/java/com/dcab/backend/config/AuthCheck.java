package com.dcab.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/authCheck")
@RequiredArgsConstructor
public class AuthCheck {

    private final  JwtService service;

    @GetMapping("/isClient")
    private boolean isClient(@RequestHeader("Authorization") String token) {
        String extractedToken = token.replace("Bearer ", "");
        String role = service.extractRole(extractedToken);

        if(role.equalsIgnoreCase("Client")){
            return true;
        }
        return false;
    }

    @GetMapping("/isDriver")
    private boolean isDriver(@RequestHeader("Authorization") String token) {
        String extractedToken = token.replace("Bearer ", "");
        String role = service.extractRole(extractedToken);

        if(role.equalsIgnoreCase("Driver")){
            return true;
        }
        return false;
    }

    @GetMapping("/isAdmin")
    private boolean isAdmin(@RequestHeader("Authorization") String token) {
        String extractedToken = token.replace("Bearer ", "");
        String role = service.extractRole(extractedToken);

        if(role.equalsIgnoreCase("Admin")){
            return true;
        }
        return false;
    }
}
