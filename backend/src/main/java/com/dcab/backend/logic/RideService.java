package com.dcab.backend.logic;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@NoArgsConstructor
public class RideService {

    private static final String[] CAR_TYPES = {"Sedan", "SUV", "Hatchback", "MiniBus"};
    
    public List<RideComponent> generateRideComponent(Double distance) {
        List<RideComponent> rideComponents = new ArrayList<>();

        RideComponent rideComponent = new RideComponent();
        if (CAR_TYPES.equals("Sedan")) {
            rideComponent = RideComponent.builder()
                    .carType("Sedan")
                    .distance(distance)
                    .seats(4)
                    .costs(calculateCost(distance, "Sedan"))
                    .build();
        } else if (CAR_TYPES.equals("SUV")) {
            rideComponent = RideComponent.builder()
                    .carType("SUV")
                    .distance(distance)
                    .seats(5)
                    .costs(calculateCost(distance, "SUV"))
                    .build();
        } else if (CAR_TYPES.equals("Hatchback")) {
            rideComponent = RideComponent.builder()
                    .carType("Hatchback")
                    .distance(distance)
                    .seats(4)
                    .costs(calculateCost(distance, "Hatchback"))
                    .build();
        } else if (CAR_TYPES.equals("Coupe")) {
            rideComponent = RideComponent.builder()
                    .carType("Coupe")
                    .distance(distance)
                    .seats(1)
                    .costs(calculateCost(distance, "Coupe"))
                    .build();
        } else if (CAR_TYPES.equals("MiniBus")) {
            rideComponent = RideComponent.builder()
                    .carType("MiniBus")
                    .distance(distance)
                    .seats(7)
                    .costs(calculateCost(distance, "MiniBus"))
                    .build();
        }
            rideComponents.add(rideComponent);

        return rideComponents;
    }

    // Helper method to calculate the cost based on distance and car type
    private double calculateCost(Double distance, String carType) {
        double baseRate;
        switch (carType) {
            case "SUV":
                baseRate = 2.0; // Higher rate for SUVs
                break;
            case "Minivan":
                baseRate = 1.8; // Slightly higher rate for Minivans
                break;
            case "Hatchback":
                baseRate = 1.2; // Lower rate for Hatchbacks
                break;
            default: // Sedan
                baseRate = 1.5;
        }
        return baseRate * distance; // Cost = base rate * distance
    }
}

