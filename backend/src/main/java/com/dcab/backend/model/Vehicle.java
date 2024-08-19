package com.dcab.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Vehicles")
public class
Vehicle {

    @Id
    @GeneratedValue
    private Integer vehicleID;
    @OneToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;
    private String name;
    private String numberPlate;
    private String colour;
    private Integer Size;
    private String carType;
    @Lob
    private byte[] insurance;
    @Lob
    private byte[] image;
}
