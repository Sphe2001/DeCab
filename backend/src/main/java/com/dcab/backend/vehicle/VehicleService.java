package com.dcab.backend.vehicle;

import com.dcab.backend.clientAuth.ClientDTO;
import com.dcab.backend.config.JwtService;
import com.dcab.backend.driverAuth.AuthenticationService2;
import com.dcab.backend.driverAuth.ImageDTO;
import com.dcab.backend.model.Client;
import com.dcab.backend.model.Driver;
import com.dcab.backend.model.Vehicle;
import com.dcab.backend.repository.VehicleImageRepository;
import com.dcab.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public boolean RegisterVehicle(VehicleRegisterRequest request, String token){

        Optional<Driver> driver = authenticationService2.getDriver(token);
        if(driver.isPresent()){
            var vehicle = Vehicle.builder()
                    .carName(request.getCarName())
                    .carType(request.getCarType())
                    .seats(request.getSeats())
                    .colour(request.getColour())
                    .numberPlate(request.getNumberPlate())
                    .images(request.getImages())
                    .driver(request.getDriver_id())
                    .build();
            repository.save(vehicle);

            return true;
        }

        return false;
    }

    @Transactional(readOnly = true)
    public Optional<VehicleRegisterRequest> getVehicleDTO(String token){


        return client.map(this::convertToDTO);
    }

    private VehicleRegisterRequest convertToDTO(Vehicle vehicle) {
        List<ImageDTO> imageDTOs = vehicle.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), image.getTitle(), image.getFileName(), image.getFileType()))
                .collect(Collectors.toList());

        return new VehicleRegisterRequest(vehicle.getCarName(),vehicle.getNumberPlate(),vehicle.getColour(),vehicle.getSeats(),
                vehicle.getCarType(),vehicle.getDriver(), imageDTOs);
    }
}
