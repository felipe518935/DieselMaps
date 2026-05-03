package com.dieselmaps.repository;

import com.dieselmaps.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Alert> findByUserIdAndIsReadFalse(Long userId);
}
