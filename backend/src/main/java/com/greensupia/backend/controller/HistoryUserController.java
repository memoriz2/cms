package com.greensupia.backend.controller;

import com.greensupia.backend.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.greensupia.backend.dto.response.HistoryResponse;

@RestController
@RequestMapping("/api/histories")
public class HistoryUserController {
    
    @Autowired
    private HistoryService historyService;
    
    // 활성화된 연혁 전체 조회(연도별 정렬)
    @GetMapping("/active")
    public List<HistoryResponse> getActiveHistories(@RequestParam(required = false) String year) {
        if(year != null && !year.isEmpty()) {
            return historyService.getActiveHistoriesByYear(year);
        }
        return historyService.getActiveHistories();
    }

    // 특정 연도의 활성화된 연혁 조회
    @GetMapping("/active/{year}")
    public List<HistoryResponse> getActiveHistoriesByYear(@PathVariable String year) {
        return historyService.getActiveHistoriesByYear(year);
    }

} 