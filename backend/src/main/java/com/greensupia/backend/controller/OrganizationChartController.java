package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.greensupia.backend.dto.request.OrganizationChartRequest;
import com.greensupia.backend.dto.response.OrganizationChartResponse;
import com.greensupia.backend.service.OrganizationChartService;
import lombok.RequiredArgsConstructor;
import java.net.URI;

@RestController
@RequestMapping("/api/portal/organization-charts")
@RequiredArgsConstructor
public class OrganizationChartController extends BaseController {
    private final OrganizationChartService organizationChartService;
    
    // 활성화된 조직도 조회
    @GetMapping("/active")
    public ResponseEntity<OrganizationChartResponse> getActiveOrganizationChart() {
        OrganizationChartResponse response = organizationChartService.getActiveOrganizationChart();
        return ResponseEntity.ok(response);
    }
    
    // 조직도 생성
    @PostMapping
    public ResponseEntity<OrganizationChartResponse> createOrganizationChart(
        @RequestParam("imageFile") MultipartFile imageFile,
        @RequestParam(value = "isActive", defaultValue = "true") boolean isActive
    ) {
        OrganizationChartRequest request = new OrganizationChartRequest();
        request.setImageFile(imageFile);
        request.setActive(isActive);
        OrganizationChartResponse response = organizationChartService.createOrganizationChart(request);
        return ResponseEntity.created(URI.create("/api/portal/organization-charts/" + response.getId())).body(response);   
    }
    
    // 조직도 수정
    @PutMapping("/{id}")
    public ResponseEntity<OrganizationChartResponse> updateOrganizationChart(
        @PathVariable Long id,
        @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
        @RequestParam(value = "isActive", defaultValue = "true") boolean isActive
    ) {
        OrganizationChartRequest request = new OrganizationChartRequest();
        request.setImageFile(imageFile);
        request.setActive(isActive);
        OrganizationChartResponse response = organizationChartService.updateOrganizationChart(id, request);
        return ResponseEntity.ok(response);
    }
    
    // 조직도 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganizationChart(@PathVariable Long id) {
        organizationChartService.deleteOrganizationChart(id);
        return ResponseEntity.noContent().build();
    }
}