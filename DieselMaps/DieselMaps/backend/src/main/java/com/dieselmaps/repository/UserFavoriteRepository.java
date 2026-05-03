package com.dieselmaps.repository;

import com.dieselmaps.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUserId(Long userId);
    List<UserFavorite> findByStationId(Long stationId);
    Optional<UserFavorite> findByUserIdAndStationId(Long userId, Long stationId);
}
