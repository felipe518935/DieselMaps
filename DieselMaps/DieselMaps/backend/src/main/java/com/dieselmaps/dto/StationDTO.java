package com.dieselmaps.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StationDTO {
    private Long id;
    private String operatorUsername;
    private String name;
    private String brand;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private boolean available;
    private LocalDateTime updatedAt;
    private List<FuelPriceDTO> prices;
}
