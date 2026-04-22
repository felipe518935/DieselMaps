package com.dieselmaps.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fuel_prices")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FuelPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;        // CORRIENTE, EXTRA, DIESEL, GAS

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceCop;      // Precio actual en pesos colombianos

    @Column(precision = 10, scale = 2)
    private BigDecimal prevPriceCop;  // Precio anterior (historial)

    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() { recordedAt = LocalDateTime.now(); }

    public enum FuelType { CORRIENTE, EXTRA, DIESEL, GAS }
}