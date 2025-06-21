package com.greensupia.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import com.greensupia.backend.entity.Banner;

@Getter
@Setter
public class BannerRequest {
    private String title;
    private String fileName;
    private String filePath;
    private boolean isActive;

    public Banner toEntity(){   
        return Banner.builder() 
            .title(title)
            .fileName(fileName)
            .filePath(filePath)
            .isActive(isActive)
            .build();
    }
}
