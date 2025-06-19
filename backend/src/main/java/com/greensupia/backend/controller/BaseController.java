package com.greensupia.backend.controller;

import org.springframework.stereotype.Component;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Component
public class BaseController {
    
    protected Pageable createPageable(int page, int size, String sortBy, String sortDir){
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        return PageRequest.of(page,size,sort);
    }
}
