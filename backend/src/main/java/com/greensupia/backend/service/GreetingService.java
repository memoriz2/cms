package com.greensupia.backend.service;

import org.springframework.stereotype.Service;
import com.greensupia.backend.entity.Greeting;
import com.greensupia.backend.repository.GreetingRepository;
import com.greensupia.backend.dto.request.EditorContentRequest;
import com.greensupia.backend.dto.response.EditorContentResponse;

@Service
public class GreetingService extends EditorContentService {
    private final GreetingRepository greetingRepository;

    public GreetingService(GreetingRepository greetingRepository, PaginationService paginationService) {
        super(greetingRepository, paginationService);
        this.greetingRepository = greetingRepository;
    }

    // 인사말만의 특별한 로직들이 필요하면 여기에 추가
    // 현재는 EditorContentService의 모든 기능을 그대로 사용
} 