package com.greensupia.backend.service;

import com.greensupia.backend.repository.OrganizationChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.greensupia.backend.dto.request.OrganizationChartRequest;
import com.greensupia.backend.dto.response.OrganizationChartResponse;
import com.greensupia.backend.entity.OrganizationChart;
import com.greensupia.backend.util.FileUtil;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;

@Service
public class OrganizationChartService {
    
    @Autowired
    private OrganizationChartRepository organizationChartRepository;

    @Autowired
    private FileUtil fileUtil;
    
    // 활성화된 조직도 조회
    public OrganizationChartResponse getActiveOrganizationChart() {
        OrganizationChart organizationChart = organizationChartRepository.findByIsActiveTrue();
        if(organizationChart == null) {
            throw new EntityNotFoundException("활성화된 조직도가 없습니다.");
        }
        return toResponse(organizationChart);
    }

    // 조직도 생성
    public OrganizationChartResponse createOrganizationChart(OrganizationChartRequest request) {
        OrganizationChart existingActive = organizationChartRepository.findByIsActiveTrue();
        if(existingActive != null) {
            existingActive.setActive(false);
            organizationChartRepository.save(existingActive);
        }
        // 새 조직도 생성성
        OrganizationChart chart = new OrganizationChart();
        chart.setFileName(request.getImageFile().getOriginalFilename());
        chart.setFilePath(fileUtil.saveFile(request.getImageFile(), "organization-chart"));
        chart.setActive(request.isActive());
        return toResponse(organizationChartRepository.save(chart));
    }

   

    // Entity -> Response 변환
    private OrganizationChartResponse toResponse(OrganizationChart chart) {
        OrganizationChartResponse response = new OrganizationChartResponse();
        response.setId(chart.getId());
        response.setFileName(chart.getFileName());
        response.setFilePath(chart.getFilePath());
        response.setActive(chart.isActive());
        response.setCreatedAt(chart.getCreatedAt());
        response.setUpdatedAt(chart.getUpdatedAt());
        return response;
    }
} 