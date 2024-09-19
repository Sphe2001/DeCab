package com.dcab.backend.clientAuth;

import com.dcab.backend.config.JwtService;
import com.dcab.backend.model.Client;
import com.dcab.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final ClientRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
            var client = Client.builder()
                    .firstName(request.getFirstName())
                    .email(request.getEmail())
                    .phoneNumber(request.getPhoneNumber())
                    .password(hashPassword(request.getPassword()))
                    .role("Client")
                    .build();
            repository.save(client);
             var jwtToken = jwtService.generateToken(client);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();

    }
    private String hashPassword(String password){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var client = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(client);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
    public Optional<Client> getClient(String token){
        String email= jwtService.extractClaim(token, claims -> claims.getSubject());

        return repository.findByEmail(email);
    }

    public boolean update(UpdateRequest request, String token){
        Optional<Client> client = getClient(token);
        if(client.isPresent()){
            Client updateClient = client.get();
            updateClient.setFirstName(request.getFirstName());
            updateClient.setEmail(request.getEmail());
            updateClient.setPhoneNumber(request.getPhoneNumber());

            repository.save(updateClient);
            return true;
        }
        else return false;
    }

    public boolean passwordUpdate(PasswordUpdateRequest request, String token){
        Optional<Client> client = getClient(token);

        if(client.isPresent()){
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean matches = false;
            matches = encoder.matches(request.getOldPassword(), client.get().getPassword());
            if(matches){

                Client updateClient = client.get();
                updateClient.setPassword(hashPassword((request.getNewPassword())));
                repository.save(updateClient);
                return true;
            }

        }
        return false;
    }
}
