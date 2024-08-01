package com.dcab.backend.repository;

import com.dcab.backend.model.Admin;
import com.dcab.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {

    Optional<Client> findByEmail(String email);
}
