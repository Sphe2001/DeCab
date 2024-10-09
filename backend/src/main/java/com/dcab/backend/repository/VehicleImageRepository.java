package com.dcab.backend.repository;

import com.dcab.backend.model.Image;
import com.dcab.backend.model.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleImageRepository  extends JpaRepository<VehicleImage, Long> {
    Optional<VehicleImage> findByVehicle_VehicleIdAndTitle(Integer VehicleId, String title);
}
