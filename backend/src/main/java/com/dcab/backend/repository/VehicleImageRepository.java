package com.dcab.backend.repository;

import com.dcab.backend.model.Image;
import com.dcab.backend.model.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VehicleImageRepository  extends JpaRepository<VehicleImage, Long> {
    @Query("SELECT v FROM VehicleImage v WHERE v.vehicle.id = :vehicleID AND v.title = :title")
    Optional<VehicleImage> findByVehicle_VehicleIdAndTitle(@Param("vehicleID") Integer vehicleID, @Param("title") String title);
}
