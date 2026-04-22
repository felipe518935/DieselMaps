package com.dieselmaps.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceUpdateRequest {

    @NotNull(message = "El tipo de combustible es requerido")
    private String fuelType;  // CORRIENTE, EXTRA, DIESEL, GAS

    @NotNull(message = "El precio es requerido")
    @Positive(message = "El precio debe ser positivo")
    private BigDecimal priceCop;
}
