package com.dcab.backend.driverAuth;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest2 {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Long id;
    private byte[] licence;
    private byte[] photo;
    private String password;
}
