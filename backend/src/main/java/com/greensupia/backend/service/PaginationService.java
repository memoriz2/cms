package com.greensupia.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import com.greensupia.backend.dto.response.PageResponse;

@Service
public class PaginationService {
    
    public <T> PageResponse<T> convertToPageResponse(Page<T> page){
        return new PageResponse<T>(
            page.getContent(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.getNumber()+1,
            page.getSize(),
            page.hasNext(),
            page.hasPrevious()
        );
    }
}
