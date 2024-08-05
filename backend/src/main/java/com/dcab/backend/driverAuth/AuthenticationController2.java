package com.dcab.backend.driverAuth;

import com.dcab.backend.adminAuth.AuthenticationRequest1;
import com.dcab.backend.adminAuth.AuthenticationResponse1;
import com.dcab.backend.adminAuth.AuthenticationService1;
import com.dcab.backend.adminAuth.RegisterRequest1;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
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
