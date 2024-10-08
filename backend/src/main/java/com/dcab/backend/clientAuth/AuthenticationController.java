package com.dcab.backend.clientAuth;

import com.dcab.backend.driverAuth.DriverDTO;
import com.dcab.backend.model.Client;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public ResponseEntity<ClientDTO> getClientDTO(
            @RequestHeader("Authorization") String token
    ){
        String extractedToken = token.replace("Bearer ", "");
        Optional<ClientDTO> clientDTO = service.getClientDTO(extractedToken);

        return clientDTO
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/update/client")
    public ResponseEntity<Boolean> updateClient(
            @RequestHeader ("Authorization") String token,
            @RequestParam(value = "profile", required = false) MultipartFile profile,
            @ModelAttribute UpdateRequest request
    ) throws IOException {
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.update(request, extractedToken, profile));
    }

    @PostMapping("/update/client/password")
    public ResponseEntity<Boolean> updateClientPassword(
            @RequestHeader ("Authorization") String token,
            @RequestBody PasswordUpdateRequest request
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.passwordUpdate(request, extractedToken));
    }

    @GetMapping("/getPhoto")
    public ResponseEntity<String> getImage(
            @RequestHeader ("Authorization") String token
    ){
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.getPhoto(extractedToken));
    }
}
