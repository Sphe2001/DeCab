package com.dcab.backend.clientAuth;

import com.dcab.backend.driverAuth.ImageDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDTO {
    private Integer clientId;
    private String firstName;
    private String email;
    private String phoneNumber;
    private String role;
    private List<ImageDTO> profilePhoto;
}
