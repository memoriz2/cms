package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.greensupia.backend.dto.response.OrganizationChartResponse;
import com.greensupia.backend.service.OrganizationChartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/organization-charts")
@RequiredArgsConstructor
public class OrganizationChartUserController {
    private final OrganizationChartService organizationChartService;
    
    // 활성화된 조직도 조회 (사용자용)
    @GetMapping("/active")
    public ResponseEntity<OrganizationChartResponse> getActiveOrganizationChart() {
        OrganizationChartResponse response = organizationChartService.getActiveOrganizationChart();
        return ResponseEntity.ok(response);
    }
}