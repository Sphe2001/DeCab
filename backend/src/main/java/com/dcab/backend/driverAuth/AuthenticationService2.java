package com.dcab.backend.driverAuth;


import com.dcab.backend.clientAuth.PasswordUpdateRequest;
import com.dcab.backend.config.JwtService;
import com.dcab.backend.model.Client;
import com.dcab.backend.model.Driver;
import com.dcab.backend.model.Image;
import com.dcab.backend.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthenticationService2 {
    private final DriverRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse2 registerDriver(RegisterRequest2 request) {
        var driver = Driver.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .id(request.getId())
                .email(request.getEmail().toLowerCase())
                .password(hashPassword(request.getPassword()))
                .role("Driver")
                .build();
        repository.save(driver);
        var jwtToken = jwtService.generateToken(driver);
        return  AuthenticationResponse2.builder()
                .token(jwtToken)
                .build();
    }

    private String hashPassword(String password){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    public AuthenticationResponse2 authenticateDriver(AuthenticationRequest2 request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );
        var client = repository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(client);
        return AuthenticationResponse2.builder()
                .token(jwtToken)
                .build();
    }
    
@Transactional(readOnly = true)
public Optional<DriverDTO> getDriverDTO(String token){
    String email = jwtService.extractClaim(token, claims -> claims.getSubject());
    Optional<Driver> driver = repository.findByEmail(email);

    return driver.map(this::convertToDTO); // Map entity to DTO
}

    private DriverDTO convertToDTO(Driver driver) {
        List<ImageDTO> imageDTOs = driver.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), image.getTitle(), image.getFileName(), image.getFileType()))
                .collect(Collectors.toList());

        return new DriverDTO(driver.getDriverId(), driver.getFirstName(), driver.getLastName(),
                driver.getEmail(), driver.getPhoneNumber(), driver.getId(), driver.getRole(), imageDTOs);
    }

    public Optional<Driver> getDriver(String token){
        String email= jwtService.extractClaim(token, claims -> claims.getSubject());

        return repository.findByEmail(email);
    }

    @Transactional
    public boolean update(UpdateRequest2 request, String token, MultipartFile licenceFile, MultipartFile photoFile) throws IOException {
        Optional<Driver> driver = getDriver(token);

        if(driver.isPresent()){
            Driver updateDriver = driver.get();

            updateDriver.setFirstName(request.getFirstName());
            updateDriver.setLastName(request.getLastName());
            updateDriver.setEmail(request.getEmail().toLowerCase());
            updateDriver.setPhoneNumber(request.getPhoneNumber());
            updateDriver.setId(request.getId());
            if(licenceFile != null && !licenceFile.isEmpty()) {
                Image licenceImage = Image.builder()
                        .title("Licence")
                        .fileName(licenceFile.getOriginalFilename())
                        .fileType(licenceFile.getContentType())
                        .data(licenceFile.getBytes())
                        .driver(updateDriver)
                        .build();
                updateDriver.getImages().add(licenceImage);
            }

            if(photoFile != null && !photoFile.isEmpty()) {
                Image photoImage = Image.builder()
                        .title("Photo")
                        .fileName(photoFile.getOriginalFilename())
                        .fileType(photoFile.getContentType())
                        .data(photoFile.getBytes())
                        .driver(updateDriver)
                        .build();
                updateDriver.getImages().add(photoImage);
            }

            repository.save(updateDriver);
            return true;
        }
        else return false;
    }

    public boolean passwordUpdate(PasswordUpdateRequest2 request, String token){
        Optional<Driver> driver = getDriver(token);

        if(driver.isPresent()){
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean matches = false;
            matches = encoder.matches(request.getOldPassword(), driver.get().getPassword());
            if(matches){

                Driver updateDriver = driver.get();
                updateDriver.setPassword(hashPassword((request.getNewPassword())));
                repository.save(updateDriver);
                return true;
            }

        }
        return false;
    }
}
