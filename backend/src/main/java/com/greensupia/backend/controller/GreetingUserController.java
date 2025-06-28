package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.greensupia.backend.dto.response.EditorContentResponse;
import com.greensupia.backend.service.GreetingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/greetings")
@RequiredArgsConstructor
public class GreetingUserController extends BaseController {
    private final GreetingService greetingService;

    // 활성화된 인사말 조회 (사용자용)
    @GetMapping("/active")
    public ResponseEntity<EditorContentResponse> getActiveGreeting() {
        try {
            // 활성 인사말 목록에서 첫 번째 인사말만 반환
            EditorContentResponse activeGreeting = greetingService.getFirstActiveGreeting();
            return ResponseEntity.ok(activeGreeting);
        } catch (Exception e) {
            // 활성 인사말이 없으면 404 반환
            return ResponseEntity.notFound().build();
        }
    }
} 