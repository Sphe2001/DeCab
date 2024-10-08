package com.dcab.backend.clientAuth;

import com.dcab.backend.config.JwtService;
import com.dcab.backend.driverAuth.ImageDTO;
import com.dcab.backend.model.Client;
import com.dcab.backend.model.ClientImage;
import com.dcab.backend.model.Image;
import com.dcab.backend.repository.ClientImageRepository;
import com.dcab.backend.repository.ClientRepository;
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
public class AuthenticationService {

    private final ClientRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ClientImageRepository imageRepository;

    public AuthenticationResponse register(RegisterRequest request) {

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
            var client = Client.builder()
                    .firstName(request.getFirstName())
                    .email(request.getEmail().toLowerCase())
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
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );
        var client = repository.findByEmail(request.getEmail().toLowerCase())
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
    @Transactional
    public boolean update(UpdateRequest request, String token, MultipartFile profile) throws IOException {
        Optional<Client> client = getClient(token);
        if(client.isPresent()) {
            Client updateClient = client.get();
            updateClient.setFirstName(request.getFirstName());
            updateClient.setEmail(request.getEmail().toLowerCase());
            updateClient.setPhoneNumber(request.getPhoneNumber());

            Integer clientId = getClientID(token);
            if (profile != null && !profile.isEmpty()) {
                Optional<ClientImage> existingPhoto = imageRepository.findByClient_ClientIdAndTitle(clientId, "profilePhoto");

                if (existingPhoto.isPresent()) {
                    // Update existing licence image
                    ClientImage profileImage = existingPhoto.get();
                    profileImage.setFileName(profile.getOriginalFilename());
                    profileImage.setFileType(profile.getContentType());
                    profileImage.setData(profile.getBytes());
                } else {
                    // Add new licence image
                    ClientImage newProfileImage = ClientImage.builder()
                            .title("profilePhoto")
                            .fileName(profile.getOriginalFilename())
                            .fileType(profile.getContentType())
                            .data(profile.getBytes())
                            .client(updateClient)
                            .build();
                    updateClient.getProfilePhoto().add(newProfileImage);
                }
            }
                repository.save(updateClient);
                return true;

            } else return false;
        }

    @Transactional(readOnly = true)
    public Optional<ClientDTO> getClientDTO(String token){
        String email = jwtService.extractClaim(token, claims -> claims.getSubject());
        Optional<Client> client = repository.findByEmail(email);

        return client.map(this::convertToDTO);
    }

    private ClientDTO convertToDTO(Client client) {
        List<ImageDTO> imageDTOs = client.getProfilePhoto().stream()
                .map(image -> new ImageDTO(image.getId(), image.getTitle(), image.getFileName(), image.getFileType()))
                .collect(Collectors.toList());

        return new ClientDTO(client.getClientId(), client.getFirstName(),
                client.getEmail(), client.getPhoneNumber(), client.getRole(), imageDTOs);
    }

    private Integer getClientID(String token){
        String email= jwtService.extractClaim(token, claims -> claims.getSubject());
        Optional<Client> client = repository.findByEmail(email);

        return client.get().getClientId();
    }

    @Transactional(readOnly = true)
    public String getPhoto(String token){
        Integer clientId = getClientID(token);

        Optional<ClientImage> photo = imageRepository.findByClient_ClientIdAndTitle(clientId, "profilePhoto");
        if (photo.isPresent()) {

            byte[] photoArray =  photo.get().getData();
            return Base64.getEncoder().encodeToString(photoArray);
        }

        return null;

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
