package com.dcab.backend.driverAuth;

import com.dcab.backend.clientAuth.PasswordUpdateRequest;
import com.dcab.backend.clientAuth.UpdateRequest;
import com.dcab.backend.model.Client;
import com.dcab.backend.model.Driver;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

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

    @GetMapping("/getDriver")
    public ResponseEntity<Optional<Driver>> getDriver(
            @RequestHeader ("Authorization") String token
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.getDriver(extractedToken));
    }

    @PutMapping("/update/driver")
    public ResponseEntity<Boolean> updateDriver(
            @RequestHeader ("Authorization") String token,
            @RequestParam(value = "licence", required = false) MultipartFile licenceFile,
            @RequestParam(value = "photo", required = false) MultipartFile photoFile,
            @ModelAttribute UpdateRequest2 request
    ) throws IOException {
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.update(request, extractedToken, licenceFile, photoFile));
    }

    @PostMapping("/update/driver/password")
    public ResponseEntity<Boolean> updateDriverPassword(
            @RequestHeader ("Authorization") String token,
            @RequestBody PasswordUpdateRequest2 request
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.passwordUpdate(request, extractedToken));
    }
}
