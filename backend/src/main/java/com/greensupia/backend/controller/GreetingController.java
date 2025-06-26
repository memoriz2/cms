package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.greensupia.backend.service.GreetingService;

@RestController
@RequestMapping("/api/portal/greetings")
public class GreetingController extends EditorContentController {
    
    public GreetingController(GreetingService greetingService) {
        super(greetingService);
    }

    // 인사말만의 특별한 API들이 필요하면 여기에 추가
    // 현재는 EditorContentController의 모든 기능을 그대로 사용
} 