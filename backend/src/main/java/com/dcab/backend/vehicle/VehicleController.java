package com.dcab.backend.vehicle;

import com.dcab.backend.driverAuth.AuthenticationResponse2;
import com.dcab.backend.driverAuth.RegisterRequest2;
import com.dcab.backend.model.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;

    @PutMapping("/register")
    public ResponseEntity<Boolean> register(
            @RequestHeader ("Authorization") String token,
            @RequestParam(value = "insurance", required = false) MultipartFile insuranceFile,
            @RequestParam(value = "frontView", required = false) MultipartFile frontViewFile,
            @RequestParam(value = "backView", required = false) MultipartFile backViewFile,
            @RequestParam(value = "sideView", required = false) MultipartFile sideViewFile,
            @ModelAttribute VehicleRegisterRequest request
    ) throws IOException {
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.RegisterVehicle(request, extractedToken, insuranceFile,
                frontViewFile, backViewFile, sideViewFile));
    }

    @GetMapping("/getVehicle")
    public ResponseEntity<Optional<VehicleRegisterRequest>> getVehicle(
            @RequestHeader ("Authorization") String token)
    {
        String extractedToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(service.getVehicle(extractedToken));
    }
}
