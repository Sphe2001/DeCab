package com.dcab.backend.adminAuth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest1 {

    private String staffNumber;
    private String firstName;
    private String email;
    private String password;
    private String role;
}
