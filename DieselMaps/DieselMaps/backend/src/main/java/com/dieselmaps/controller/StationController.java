package com.dieselmaps.controller;

import com.dieselmaps.dto.*;
import com.dieselmaps.service.StationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;

    // Público: ver estaciones cercanas por coordenadas
    @GetMapping("/public/nearby")
    public ResponseEntity<List<StationDTO>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radiusKm) {
        return ResponseEntity.ok(stationService.findNearby(lat, lng, radiusKm));
    }

    // Operador/Admin: registrar una nueva estación
    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<StationDTO> create(@Valid @RequestBody StationRequest req,
                                              @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(201).body(stationService.create(req, user.getUsername()));
    }

    // Operador/Admin: actualizar precio (guarda historial automáticamente)
    @PatchMapping("/{id}/prices")
    @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
    public ResponseEntity<FuelPriceDTO> updatePrice(@PathVariable Long id,
                                                     @Valid @RequestBody PriceUpdateRequest req) {
        return ResponseEntity.ok(stationService.updatePrice(id, req));
    }

    // Todos los autenticados: ver detalle de una estación
    @GetMapping("/{id}")
    public ResponseEntity<StationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stationService.findById(id));
    }
}