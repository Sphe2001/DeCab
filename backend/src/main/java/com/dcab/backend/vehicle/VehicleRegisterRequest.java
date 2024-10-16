package com.dcab.backend.vehicle;

import com.dcab.backend.driverAuth.ImageDTO;
import com.dcab.backend.model.Driver;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VehicleRegisterRequest {
    private String carModel;
    private String numberPlate;
    private String colour;
    private Integer seats;
    private String carType;
    private Driver driver_id;
    private List<ImageDTO> images;
}
