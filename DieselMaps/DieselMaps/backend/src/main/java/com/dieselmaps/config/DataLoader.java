package com.dieselmaps.config;

import com.dieselmaps.entity.FuelPrice;
import com.dieselmaps.entity.Station;
import com.dieselmaps.entity.User;
import com.dieselmaps.repository.FuelPriceRepository;
import com.dieselmaps.repository.StationRepository;
import com.dieselmaps.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final FuelPriceRepository fuelPriceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo cargar datos si no existen usuarios
        if (userRepository.count() > 0) {
            return;
        }

        // Crear solo el admin
        User admin = User.builder()
                .username("admin")
                .email("admin@dieselmaps.com")
                .passwordHash("$2a$10$N9qo8uLOickgxn0ZtmmWmexcvgvhbYLo5ZvhJJVvLmCOQ3TcKtX7y") // password: 12345
                .role(User.Role.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        // Crear estaciones de prueba con ubicaciones reales de Bogotá
        Station[] testStations = {
            Station.builder()
                    .operator(admin)
                    .name("Terpel Centro")
                    .brand("Terpel")
                    .latitude(new BigDecimal("4.7110"))
                    .longitude(new BigDecimal("-74.0721"))
                    .address("Calle 50 #10-50, Bogotá")
                    .available(true)
                    .updatedAt(LocalDateTime.now())
                    .build(),
            Station.builder()
                    .operator(admin)
                    .name("Biomax Chapinero")
                    .brand("Biomax")
                    .latitude(new BigDecimal("4.7327"))
                    .longitude(new BigDecimal("-74.0511"))
                    .address("Carrera 7 #100-50, Chapinero, Bogotá")
                    .available(true)
                    .updatedAt(LocalDateTime.now())
                    .build(),
            Station.builder()
                    .operator(admin)
                    .name("Primax Usaquén")
                    .brand("Primax")
                    .latitude(new BigDecimal("4.8015"))
                    .longitude(new BigDecimal("-74.0250"))
                    .address("Avenida Paseo Usaquén #50-70, Bogotá")
                    .available(true)
                    .updatedAt(LocalDateTime.now())
                    .build(),
            Station.builder()
                    .operator(admin)
                    .name("Ecopetrol Kennedy")
                    .brand("Ecopetrol")
                    .latitude(new BigDecimal("4.6150"))
                    .longitude(new BigDecimal("-74.1642"))
                    .address("Avenida Carrera 78 #5-30, Kennedy, Bogotá")
                    .available(true)
                    .updatedAt(LocalDateTime.now())
                    .build(),
            Station.builder()
                    .operator(admin)
                    .name("Shell Suba")
                    .brand("Shell")
                    .latitude(new BigDecimal("4.8490"))
                    .longitude(new BigDecimal("-74.0685"))
                    .address("Avenida Suba #119-50, Suba, Bogotá")
                    .available(true)
                    .updatedAt(LocalDateTime.now())
                    .build(),
        };

        // Guardar estaciones
        for (Station station : testStations) {
            stationRepository.save(station);

            // Agregar precios de prueba
            FuelPrice[] prices = {
                FuelPrice.builder()
                        .station(station)
                        .fuelType(FuelPrice.FuelType.CORRIENTE)
                        .priceCop(new BigDecimal("11500"))
                        .recordedAt(LocalDateTime.now())
                        .build(),
                FuelPrice.builder()
                        .station(station)
                        .fuelType(FuelPrice.FuelType.DIESEL)
                        .priceCop(new BigDecimal("11200"))
                        .recordedAt(LocalDateTime.now())
                        .build(),
                FuelPrice.builder()
                        .station(station)
                        .fuelType(FuelPrice.FuelType.EXTRA)
                        .priceCop(new BigDecimal("12500"))
                        .recordedAt(LocalDateTime.now())
                        .build(),
            };

            for (FuelPrice price : prices) {
                fuelPriceRepository.save(price);
            }
        }
    }
}
