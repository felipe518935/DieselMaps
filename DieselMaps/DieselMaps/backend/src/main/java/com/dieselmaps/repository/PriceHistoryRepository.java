package com.dieselmaps.repository;

import com.dieselmaps.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByStationIdOrderByRecordedAtAsc(Long stationId);
}
