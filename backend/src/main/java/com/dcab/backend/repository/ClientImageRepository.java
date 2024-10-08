package com.dcab.backend.repository;

import com.dcab.backend.model.ClientImage;
import com.dcab.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientImageRepository  extends JpaRepository<ClientImage, Long> {
    Optional<ClientImage> findByClient_ClientIdAndTitle(Integer clientID, String title);
}
