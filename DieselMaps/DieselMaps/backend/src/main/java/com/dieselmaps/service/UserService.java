package com.dieselmaps.service;

import com.dieselmaps.dto.AlertDTO;
import com.dieselmaps.dto.UserFavoriteDTO;
import com.dieselmaps.entity.Alert;
import com.dieselmaps.entity.Station;
import com.dieselmaps.entity.User;
import com.dieselmaps.entity.UserFavorite;
import com.dieselmaps.repository.AlertRepository;
import com.dieselmaps.repository.StationRepository;
import com.dieselmaps.repository.UserFavoriteRepository;
import com.dieselmaps.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final AlertRepository alertRepository;

    @Transactional
    public void toggleFavorite(String username, Long stationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada"));

        Optional<UserFavorite> existing = userFavoriteRepository.findByUserIdAndStationId(user.getId(), stationId);
        if (existing.isPresent()) {
            userFavoriteRepository.delete(existing.get());
        } else {
            UserFavorite favorite = UserFavorite.builder()
                    .user(user)
                    .station(station)
                    .build();
            userFavoriteRepository.save(favorite);
        }
    }

    @Transactional(readOnly = true)
    public List<UserFavoriteDTO> getFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return userFavoriteRepository.findByUserId(user.getId()).stream()
                .map(fav -> UserFavoriteDTO.builder()
                        .id(fav.getId())
                        .stationId(fav.getStation().getId())
                        .stationName(fav.getStation().getName())
                        .createdAt(fav.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlertDTO> getAlerts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return alertRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(alert -> AlertDTO.builder()
                        .id(alert.getId())
                        .message(alert.getMessage())
                        .read(alert.isRead())
                        .createdAt(alert.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAlertAsRead(String username, Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        
        if (!alert.getUser().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permiso para modificar esta alerta");
        }
        
        alert.setRead(true);
        alertRepository.save(alert);
    }
}
