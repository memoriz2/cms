package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.service.GreetingService;
import com.greensupia.backend.dto.request.EditorContentRequest;
import com.greensupia.backend.dto.response.EditorContentResponse;
import com.greensupia.backend.dto.response.PageResponse;

@RestController
@RequestMapping("/api/portal/greetings")
public class GreetingController {
    
    private final GreetingService greetingService;

    public GreetingController(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @GetMapping("/list")
    public PageResponse<EditorContentResponse> getGreetings(Pageable pageable) {
        return greetingService.getGreetings(pageable);
    }

    @PostMapping
    public EditorContentResponse createGreeting(@RequestBody EditorContentRequest request) {
        return greetingService.createGreeting(request);
    }

    @PutMapping("/{id}")
    public EditorContentResponse updateGreeting(@PathVariable Long id, @RequestBody EditorContentRequest request) {
        return greetingService.updateGreeting(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteGreeting(@PathVariable Long id) {
        greetingService.deleteGreeting(id);
    }

    @GetMapping("/{id}")
    public EditorContentResponse getGreeting(@PathVariable Long id) {
        return greetingService.getGreeting(id);
    }
} 