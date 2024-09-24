package com.dcab.backend.config;

import com.dcab.backend.repository.AdminRepository;
import com.dcab.backend.repository.ClientRepository;
import com.dcab.backend.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final ClientRepository clientRepository;
    private final AdminRepository adminRepository;
    private final DriverRepository driverRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // First, check the ClientRepository
            var client = clientRepository.findByEmail(username);
            if (client.isPresent()) {
                return client.get();
            }

            // Then, check the AdminRepository
            var admin = adminRepository.findByStaffNumber(username);
            if (admin.isPresent()) {
                return admin.get();
            }

            // Finally, check the DriverRepository
            var driver = driverRepository.findByEmail(username);
            if (driver.isPresent()) {
                return driver.get();
            }

            // If no user is found in any of the repositories, throw an exception
            throw new UsernameNotFoundException("User not found");
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
