package com.greensupia.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HistoryRequest {
    private String year;
    private String description;
    private Integer sortOrder;
    private Boolean isActive;
} 