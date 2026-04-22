package com.dieselmaps.service;

import com.dieselmaps.dto.*;
import com.dieselmaps.entity.FuelPrice;
import com.dieselmaps.entity.Station;
import com.dieselmaps.entity.User;
import com.dieselmaps.repository.FuelPriceRepository;
import com.dieselmaps.repository.StationRepository;
import com.dieselmaps.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StationService {

    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final FuelPriceRepository fuelPriceRepository;

    @Transactional(readOnly = true)
    public List<StationDTO> findNearby(double lat, double lng, double radiusKm) {
        List<Station> stations = stationRepository.findNearby(lat, lng, radiusKm);
        return stations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StationDTO create(StationRequest req, String operatorUsername) {
        User operator = userRepository.findByUsername(operatorUsername)
                .orElseThrow(() -> new RuntimeException("Usuario operador no encontrado"));

        // Verificar que el usuario sea operador o admin
        if (!operator.getRole().equals(User.Role.OPERATOR) && !operator.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Solo operadores o administradores pueden registrar estaciones");
        }

        Station station = Station.builder()
                .operator(operator)
                .name(req.getName())
                .brand(req.getBrand())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .address(req.getAddress())
                .available(true)
                .updatedAt(LocalDateTime.now())
                .build();

        if (req.getPrices() == null || req.getPrices().isEmpty()) {
            throw new RuntimeException("Se requieren precios de combustible al registrar la estación");
        }

        station.setPrices(req.getPrices().stream()
                .map(priceReq -> FuelPrice.builder()
                        .station(station)
                        .fuelType(FuelPrice.FuelType.valueOf(priceReq.getFuelType().toUpperCase()))
                        .priceCop(priceReq.getPriceCop())
                        .recordedAt(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList()));

        stationRepository.save(station);
        return convertToDTO(station);
    }

    @Transactional
    public FuelPriceDTO updatePrice(Long stationId, PriceUpdateRequest req) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada"));

        FuelPrice.FuelType fuelType = FuelPrice.FuelType.valueOf(req.getFuelType().toUpperCase());

        FuelPrice fuelPrice = fuelPriceRepository.findByStationIdAndFuelType(stationId, fuelType)
                .orElse(FuelPrice.builder()
                        .station(station)
                        .fuelType(fuelType)
                        .build());

        // Guardar precio anterior
        if (fuelPrice.getPriceCop() != null) {
            fuelPrice.setPrevPriceCop(fuelPrice.getPriceCop());
        }

        fuelPrice.setPriceCop(req.getPriceCop());
        fuelPrice.setRecordedAt(LocalDateTime.now());

        fuelPriceRepository.save(fuelPrice);
        station.setUpdatedAt(LocalDateTime.now());
        stationRepository.save(station);

        return convertPriceToDTO(fuelPrice);
    }

    @Transactional(readOnly = true)
    public StationDTO findById(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada"));
        return convertToDTO(station);
    }

    private StationDTO convertToDTO(Station station) {
        List<FuelPriceDTO> prices = station.getPrices() != null
                ? station.getPrices().stream()
                    .map(this::convertPriceToDTO)
                    .collect(Collectors.toList())
                : List.of();

        return StationDTO.builder()
                .id(station.getId())
                .operatorUsername(station.getOperator().getUsername())
                .name(station.getName())
                .brand(station.getBrand())
                .latitude(station.getLatitude())
                .longitude(station.getLongitude())
                .address(station.getAddress())
                .available(station.isAvailable())
                .updatedAt(station.getUpdatedAt())
                .prices(prices)
                .build();
    }

    private FuelPriceDTO convertPriceToDTO(FuelPrice price) {
        return FuelPriceDTO.builder()
                .id(price.getId())
                .fuelType(price.getFuelType().name())
                .priceCop(price.getPriceCop())
                .prevPriceCop(price.getPrevPriceCop())
                .recordedAt(price.getRecordedAt())
                .build();
    }
}
