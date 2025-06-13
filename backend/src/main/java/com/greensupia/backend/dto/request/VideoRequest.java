package com.greensupia.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoRequest {
    private String title;
    private String description;
    private String youtubeUrl;
    private String thumbnailUrl;
    private Integer displayOrder;
    private Boolean isActive;
}
