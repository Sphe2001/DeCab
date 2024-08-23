package com.dcab.backend.driverAuth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/driver/auth")
@RequiredArgsConstructor
public class AuthenticationController2 {

    private final AuthenticationService2 service;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse2> register(
            @RequestBody RegisterRequest2 request
    ) {
        return ResponseEntity.ok(service.registerDriver(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse2> authenticate(
            @RequestBody AuthenticationRequest2 request
    ) {
        return ResponseEntity.ok(service.authenticateDriver(request));
    }
}
