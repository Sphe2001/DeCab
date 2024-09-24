package com.dcab.backend.driverAuth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequest2 {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Long id;


}
