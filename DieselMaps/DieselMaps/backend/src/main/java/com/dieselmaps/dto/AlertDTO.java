package com.dieselmaps.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AlertDTO {
    private Long id;
    private String message;
    @JsonProperty("isRead")
    private boolean read;
    private LocalDateTime createdAt;
}
