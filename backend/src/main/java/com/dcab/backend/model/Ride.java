package com.dcab.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.geo.Point;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "RideDetails")
public class Ride {

    @Id
    @GeneratedValue
    private Integer rideId;
    private Point pickUp;
    private Point destination;
    private Double distance;
    private Double cost;
    private Date pickUpTime;
    private Date dropOffTime;
    private Integer chosenSeat;
    private String chosenCarType;
    @OneToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    @OneToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

}
