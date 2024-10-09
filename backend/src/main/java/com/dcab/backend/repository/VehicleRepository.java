package com.dcab.backend.repository;

import com.dcab.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    @Override
    Optional<Vehicle> findById(Integer id);
}
