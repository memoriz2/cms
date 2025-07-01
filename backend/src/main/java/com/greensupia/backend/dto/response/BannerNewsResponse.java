package com.greensupia.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BannerNewsResponse {
    private Long id;
    private String title;
    private String source;
    private String imagePath;
    private String linkUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
