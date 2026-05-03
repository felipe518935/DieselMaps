package com.dieselmaps.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PriceHistoryDTO {
    private Long id;
    private String fuelType;
    private BigDecimal priceCop;
    private LocalDateTime recordedAt;
}
