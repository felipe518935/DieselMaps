package com.dieselmaps.repository;

import com.dieselmaps.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByOperatorId(Long operatorId);
    
    Optional<Station> findById(Long id);
    
    // Búsqueda por proximidad geográfica usando fórmula de distancia
    @Query(value = "SELECT * FROM stations WHERE " +
            "( 6371 * acos( cos( radians(:lat) ) * cos( radians( latitude ) ) * " +
            "cos( radians( longitude ) - radians(:lng) ) + " +
            "sin( radians(:lat) ) * sin( radians( latitude ) ) ) ) <= :radiusKm",
            nativeQuery = true)
    List<Station> findNearby(@Param("lat") double latitude,
                             @Param("lng") double longitude,
                             @Param("radiusKm") double radiusKm);
}
