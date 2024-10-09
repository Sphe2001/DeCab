package com.dcab.backend.repository;

import com.dcab.backend.model.Image;
import com.dcab.backend.model.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleImageRepository  extends JpaRepository<VehicleImage, Long> {
    //VehicleImage findByVehicle_VehicleIdAndTitle(Integer vehicleID, String title);
}
