package com.dcab.backend.repository;

import com.dcab.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Optional<Image> findByDriver_DriverIdAndTitle(Integer driverId, String title);
}
