package com.dcab.backend.clientAuth;

import com.dcab.backend.model.Client;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/client/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/getClient")
    public ResponseEntity<Optional<Client>> getClient(
            @RequestHeader ("Authorization") String token
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.getClient(extractedToken));
    }

    @PostMapping("/update/client")
    public ResponseEntity<Boolean> updateClient(
            @RequestHeader ("Authorization") String token,
            @RequestBody UpdateRequest request
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.update(request, extractedToken));
    }

    @PostMapping("/update/client/password")
    public ResponseEntity<Boolean> updateClientPassword(
            @RequestHeader ("Authorization") String token,
            @RequestBody PasswordUpdateRequest request
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.passwordUpdate(request, extractedToken));
    }
}
