package com.dieselmaps.config;

import com.dieselmaps.entity.User;
import com.dieselmaps.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario admin por defecto si no existe
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                .username("admin")
                .email("admin@diesel-maps.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .phone("3000000000")
                .birthDate(java.time.LocalDate.of(1990, 1, 1))
                .role(User.Role.ADMIN)
                .active(true)
                .build();

            userRepository.save(admin);
            System.out.println("✅ Usuario admin creado:");
            System.out.println("   Username: admin");
            System.out.println("   Password: admin123");
            System.out.println("   Role: ADMIN");
        } else {
            System.out.println("ℹ️ Usuario admin ya existe");
        }
    }
}