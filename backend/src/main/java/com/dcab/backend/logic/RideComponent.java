package com.dcab.backend.logic;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class RideComponent {


    private Integer id;
    private String carType;
    private Double distance;
    private Integer seats;
    private Double cost;

}
