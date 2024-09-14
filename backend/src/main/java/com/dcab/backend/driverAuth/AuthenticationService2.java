package com.dcab.backend.driverAuth;


import com.dcab.backend.clientAuth.AuthenticationRequest;
import com.dcab.backend.clientAuth.AuthenticationResponse;
import com.dcab.backend.config.JwtService;
import com.dcab.backend.model.Driver;
import com.dcab.backend.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService2 {
    private final DriverRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse2 registerDriver(RegisterRequest2 request) {
        var driver = Driver.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .licence(request.getLicence())
                .id(request.getId())
                .photo(request.getPhoto())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("Driver")
                .build();
        repository.save(driver);
        var jwtToken = jwtService.generateToken(driver);
        return  AuthenticationResponse2.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse2 authenticateDriver(AuthenticationRequest2 request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var client = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(client);
        return AuthenticationResponse2.builder()
                .token(jwtToken)
                .build();
    }
}
