package com.dcab.backend.repository;

import com.dcab.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    @Query("SELECT v FROM Vehicle v WHERE v.driver.id = :driverId")
    Optional<Vehicle> findByDriverId(@Param("driverId")Integer driverId);
}
