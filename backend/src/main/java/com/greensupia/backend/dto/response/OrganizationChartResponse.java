package com.greensupia.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrganizationChartResponse {
    private Long id;
    private String fileName;
    private String filePath;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 