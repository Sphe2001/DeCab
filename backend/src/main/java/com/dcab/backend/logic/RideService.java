package com.dcab.backend.logic;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {

    private static final String[] CAR_TYPES = {"Sedan", "SUV", "Hatchback", "MiniBus"};
    private static final Integer[] SEATS = {4, 5, 4, 7};
    
    public List<RideComponent> generateRideComponent(RideRequest request) {
        List<RideComponent> rideComponents = new ArrayList<>();

        RideComponent rideComponent;


        Double distanceInDouble = Double.valueOf(request.getDistance());

        for(int i = 0; i < CAR_TYPES.length; i++){
            rideComponent = RideComponent.builder()
                        .id(i + 1)
                        .carType(CAR_TYPES[i])
                        .distance(distanceInDouble)
                        .seats(SEATS[i])
                        .cost(calculateCost(distanceInDouble, CAR_TYPES[i], request.getRideTime(), request.isAdvanceBooking() ))
                        .build();

            rideComponents.add(rideComponent);

        }


        return rideComponents;
    }


    public double calculateCost(Double distance, String carType, Date rideTime, boolean isAdvanceBooking) {
        double baseRate;

        // Determine base rate based on car type
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

        // Add a multiplier for time of day
        double timeMultiplier = getTimeMultiplier(rideTime);

        // Add discount or surcharge for advance booking
        double bookingMultiplier = isAdvanceBooking ? 0.9 : 1.2; // 10% discount for advance booking, 20% surcharge for immediate booking

        // Calculate the total cost
        return baseRate * distance * timeMultiplier * bookingMultiplier;
    }

    private double getTimeMultiplier(Date rideTime) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(rideTime);

        int hour = calendar.get(Calendar.HOUR_OF_DAY);

        // Peak hours: 7 AM to 9 AM and 5 PM to 8 PM
        if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 20)) {
            return 1.5; // 50% higher during peak hours
        }

        // Nighttime: 10 PM to 5 AM
        if (hour >= 22 || hour < 5) {
            return 1.2; // 20% higher at night
        }

        // Default multiplier
        return 1.0;
    }
}

