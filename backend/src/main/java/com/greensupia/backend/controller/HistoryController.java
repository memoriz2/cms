package com.greensupia.backend.controller;

import com.greensupia.backend.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.dto.request.HistoryRequest;
import com.greensupia.backend.dto.response.HistoryResponse;

@RestController
@RequestMapping("/api/portal/histories")
public class HistoryController {
    
    @Autowired
    private HistoryService historyService;
    
    // 전체 연혁 페이징 조회
    @GetMapping
    public Page<HistoryResponse> getAllHistories(Pageable pageable) {
        return historyService.getAllHistories(pageable);
    }

    // 연혁 생성
    @PostMapping
    public HistoryResponse create(@RequestBody HistoryRequest request) {
        return historyService.createHistory(request);
    }

    // 연혁 수정
    @PutMapping("/{id}")
    public HistoryResponse update(@PathVariable Long id, @RequestBody HistoryRequest request) {
        return historyService.updateHistory(id, request);
    }

    // 연혁 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        historyService.deleteHistory(id);
    }

    // 활성화/비활성화 토글
    @PutMapping("/{id}/active")
    public HistoryResponse toggleActive(@PathVariable Long id, @RequestParam boolean isActive) {
        return historyService.toggleActive(id, isActive);
    }

    // 활성화된 연혁 페이징 조회
    @GetMapping("/active")
    public Page<HistoryResponse> getActiveHistories(Pageable pageable) {
        return historyService.getActiveHistories(pageable);
    }
} 