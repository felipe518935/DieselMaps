package com.dieselmaps.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserFavoriteDTO {
    private Long id;
    private Long stationId;
    private String stationName;
    private LocalDateTime createdAt;
}
