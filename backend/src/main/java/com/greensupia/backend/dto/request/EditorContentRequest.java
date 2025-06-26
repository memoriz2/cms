package com.greensupia.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditorContentRequest {
    private String title;
    private String content;
    private Boolean isActive;
}
