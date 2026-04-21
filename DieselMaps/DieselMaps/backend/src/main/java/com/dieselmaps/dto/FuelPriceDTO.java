package com.dieselmaps.dto;

import com.dieselmaps.entity.FuelPrice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelPriceDTO {
    private Long id;
    private String fuelType;  // CORRIENTE, EXTRA, DIESEL, GAS
    private BigDecimal priceCop;
    private BigDecimal prevPriceCop;
    private LocalDateTime recordedAt;
}
