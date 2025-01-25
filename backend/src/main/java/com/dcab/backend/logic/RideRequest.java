package com.dcab.backend.logic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RideRequest {

    private String distance;
    private Date rideTime;
    private boolean isAdvanceBooking;
}
