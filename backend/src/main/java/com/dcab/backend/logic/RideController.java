package com.dcab.backend.logic;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/ride/")
@RequiredArgsConstructor
public class RideController {

    private final RideService service;

    @PostMapping("/generate")
    public ResponseEntity<List<RideComponent>> generateRideComp(
            @RequestBody RideRequest distance
    ) {
        return ResponseEntity.ok(service.generateRideComponent(distance));
    }

}
