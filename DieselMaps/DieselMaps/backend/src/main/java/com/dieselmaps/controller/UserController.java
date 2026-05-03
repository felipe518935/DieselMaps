package com.dieselmaps.controller;

import com.dieselmaps.dto.AlertDTO;
import com.dieselmaps.dto.UserFavoriteDTO;
import com.dieselmaps.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/favorites/{stationId}")
    public ResponseEntity<Void> toggleFavorite(@PathVariable Long stationId, Authentication authentication) {
        userService.toggleFavorite(authentication.getName(), stationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<UserFavoriteDTO>> getFavorites(Authentication authentication) {
        return ResponseEntity.ok(userService.getFavorites(authentication.getName()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AlertDTO>> getAlerts(Authentication authentication) {
        return ResponseEntity.ok(userService.getAlerts(authentication.getName()));
    }

    @PutMapping("/alerts/{alertId}/read")
    public ResponseEntity<Void> markAlertAsRead(@PathVariable Long alertId, Authentication authentication) {
        userService.markAlertAsRead(authentication.getName(), alertId);
        return ResponseEntity.ok().build();
    }
}
