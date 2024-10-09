package com.dcab.backend.vehicle;

import com.dcab.backend.clientAuth.ClientDTO;
import com.dcab.backend.config.JwtService;
import com.dcab.backend.driverAuth.AuthenticationService2;
import com.dcab.backend.driverAuth.ImageDTO;
import com.dcab.backend.model.*;
import com.dcab.backend.repository.VehicleImageRepository;
import com.dcab.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository repository;
    private final  VehicleImageRepository vehicleImageRepository;
    private final AuthenticationService2 authenticationService2;
    private final JwtService jwtService;

    @Transactional(readOnly = false)
    public boolean RegisterVehicle(VehicleRegisterRequest request, String token, MultipartFile insuranceFile, MultipartFile frontViewFile, MultipartFile backViewFile, MultipartFile sideViewFile) throws IOException {

        Optional<Driver> driver = authenticationService2.getDriver(token);
        if(driver.isPresent()){
            var vehicle = Vehicle.builder()
                    .carName(request.getCarName())
                    .carType(request.getCarType())
                    .seats(request.getSeats())
                    .colour(request.getColour())
                    .numberPlate(request.getNumberPlate())
                    .driver(driver.get())
                    .build();
            repository.save(vehicle);

            List<VehicleImage> vehicleImages = List.of(
                    createVehicleImage("Insurance", insuranceFile, vehicle),
                    createVehicleImage("Front View", frontViewFile, vehicle),
                    createVehicleImage("Back View", backViewFile, vehicle),
                    createVehicleImage("Side View", sideViewFile, vehicle)
            );

            vehicleImageRepository.saveAll(vehicleImages);

            return true;
        }

        return false;
    }

    private VehicleImage createVehicleImage(String title, MultipartFile file, Vehicle vehicle) throws IOException {
        return VehicleImage.builder()
                .title(title)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .data(file.getBytes())
                .vehicle(vehicle)
                .build();
    }

    private VehicleRegisterRequest convertToDTO(Vehicle vehicle) {
        List<ImageDTO> imageDTOs = vehicle.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), image.getTitle(), image.getFileName(), image.getFileType()))
                .collect(Collectors.toList());
        return new VehicleRegisterRequest(vehicle.getCarName(), vehicle.getNumberPlate(), vehicle.getColour(), vehicle.getSeats(),
                vehicle.getCarType(), vehicle.getDriver(), imageDTOs);

    }

    @Transactional
    public Optional<VehicleRegisterRequest> getVehicle(String token){
        Integer driverID = authenticationService2.getDriverID(token);

        Optional<Vehicle> vehicle = repository.findByDriverId(driverID);

        return vehicle.map(this::convertToDTO);
    }


}
