package com.dieselmaps.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class StationRequest {

    @NotBlank(message = "El nombre de la estación es requerido")
    private String name;

    private String brand;

    @NotNull(message = "La latitud es requerida")
    @DecimalMin(value = "-90.0", message = "Latitud inválida")
    @DecimalMax(value = "90.0", message = "Latitud inválida")
    private BigDecimal latitude;

    @NotNull(message = "La longitud es requerida")
    @DecimalMin(value = "-180.0", message = "Longitud inválida")
    @DecimalMax(value = "180.0", message = "Longitud inválida")
    private BigDecimal longitude;

    private String address;

    @Valid
    private List<PriceUpdateRequest> prices;
}
