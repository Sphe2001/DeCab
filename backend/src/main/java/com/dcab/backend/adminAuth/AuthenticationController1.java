package com.dcab.backend.adminAuth;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AuthenticationController1 {

    private final AuthenticationService1 service;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse1> register(
            @RequestBody RegisterRequest1 request
    ) {
        return ResponseEntity.ok(service.registerAdmin(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse1> authenticate(
            @RequestBody AuthenticationRequest1 request
    ) {
        return ResponseEntity.ok(service.authenticateAdmin(request));
    }
}
