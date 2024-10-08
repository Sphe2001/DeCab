package com.dcab.backend.driverAuth;



import com.dcab.backend.config.JwtService;
import com.dcab.backend.model.Driver;
import com.dcab.backend.model.Image;
import com.dcab.backend.repository.DriverRepository;
import com.dcab.backend.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
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


@Service
@RequiredArgsConstructor
public class AuthenticationService2 {
    private final DriverRepository repository;
    private final ImageRepository imageRepository;
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
                .isVerified(false)
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

    return driver.map(this::convertToDTO);
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

            Integer driverId = getDriverID(token);
            if (licenceFile != null && !licenceFile.isEmpty()) {
                Optional<Image> existingLicence = imageRepository.findByDriver_DriverIdAndTitle(driverId, "Licence");

                if (existingLicence.isPresent()) {
                    // Update existing licence image
                    Image licenceImage = existingLicence.get();
                    licenceImage.setFileName(licenceFile.getOriginalFilename());
                    licenceImage.setFileType(licenceFile.getContentType());
                    licenceImage.setData(licenceFile.getBytes());
                } else {
                    // Add new licence image
                    Image newLicenceImage = Image.builder()
                            .title("Licence")
                            .fileName(licenceFile.getOriginalFilename())
                            .fileType(licenceFile.getContentType())
                            .data(licenceFile.getBytes())
                            .driver(updateDriver)
                            .build();
                    updateDriver.getImages().add(newLicenceImage);
                }
            }

            // Update or replace the photo image
            if (photoFile != null && !photoFile.isEmpty()) {
                Optional<Image> existingPhoto = imageRepository.findByDriver_DriverIdAndTitle(driverId, "Photo");

                if (existingPhoto.isPresent()) {
                    // Update existing photo image
                    Image photoImage = existingPhoto.get();
                    photoImage.setFileName(photoFile.getOriginalFilename());
                    photoImage.setFileType(photoFile.getContentType());
                    photoImage.setData(photoFile.getBytes());
                } else {
                    // Add new photo image
                    Image newPhotoImage = Image.builder()
                            .title("Photo")
                            .fileName(photoFile.getOriginalFilename())
                            .fileType(photoFile.getContentType())
                            .data(photoFile.getBytes())
                            .driver(updateDriver)
                            .build();
                    updateDriver.getImages().add(newPhotoImage);
                }
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

    private Integer getDriverID(String token){
        String email= jwtService.extractClaim(token, claims -> claims.getSubject());
        Optional<Driver> driver = repository.findByEmail(email);

        return driver.get().getDriverId();
    }



    @Transactional(readOnly = true)
    public String getPhoto(String token){
        Integer driverId = getDriverID(token);

        Optional<Image> photo = imageRepository.findByDriver_DriverIdAndTitle(driverId, "Photo");
        if (photo.isPresent()) {

            byte[] photoArray =  photo.get().getData();
            return Base64.getEncoder().encodeToString(photoArray);
        }

        return null;

    }

    @Transactional(readOnly = true)
    public boolean hasLicence(String token){
        boolean check = false;
        Integer driverId = getDriverID(token);
        Optional<Image> licence = imageRepository.findByDriver_DriverIdAndTitle(driverId, "Licence");
        if(licence.isPresent()){
            check = true;
        }
        return check;
    }
}
