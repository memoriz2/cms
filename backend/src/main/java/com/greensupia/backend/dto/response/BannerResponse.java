package com.greensupia.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BannerResponse {
    private Long id;
    private String title;
    private String fileName;
    private String filePath;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
