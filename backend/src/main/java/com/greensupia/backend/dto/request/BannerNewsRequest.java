package com.greensupia.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerNewsRequest {
    private String title;
    private String source;
    private String imagePath;
    private String linkUrl;
    private boolean isActive;
}
