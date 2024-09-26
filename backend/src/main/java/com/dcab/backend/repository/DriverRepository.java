package com.dcab.backend.repository;

import com.dcab.backend.model.Client;
import com.dcab.backend.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Integer> {

    Optional<Driver> findByEmail(String email);

}
