package com.dcab.backend.adminAuth;

import com.dcab.backend.config.JwtService;
import com.dcab.backend.model.Admin;
import com.dcab.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService1 {

    private final AdminRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse1 registerAdmin(RegisterRequest1 request) {
        var admin = Admin.builder()
                .staffNumber(request.getStaffNumber())
                .firstName(request.getFirstName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        repository.save(admin);
        var jwtToken = jwtService.generateToken(admin);
        return  AuthenticationResponse1.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse1 authenticateAdmin(AuthenticationRequest1 request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getStaffNumber(),
                        request.getPassword()
                )
        );
        var admin = repository.findByStaffNumber(request.getStaffNumber())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(admin);
        return AuthenticationResponse1.builder()
                .token(jwtToken)
                .build();
    }
}
