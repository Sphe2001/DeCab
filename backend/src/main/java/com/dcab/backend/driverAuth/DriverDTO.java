package com.dcab.backend.driverAuth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverDTO {

    private Integer driverId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Long id;
    private String role;
    private List<ImageDTO> images;
}
