package com.greensupia.backend.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class OrganizationChartRequest {
    private MultipartFile imageFile;
    private boolean isActive;
} 