package com.greensupia.backend.service;

import com.greensupia.backend.repository.OrganizationChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.greensupia.backend.dto.request.OrganizationChartRequest;
import com.greensupia.backend.dto.response.OrganizationChartResponse;
import com.greensupia.backend.entity.OrganizationChart;
import com.greensupia.backend.util.FileUtil;
import jakarta.persistence.EntityNotFoundException;

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
        // 새 조직도 생성
        OrganizationChart chart = new OrganizationChart();
        chart.setFileName(request.getImageFile().getOriginalFilename());
        chart.setFilePath(fileUtil.saveFile(request.getImageFile(), "organization-chart"));
        chart.setActive(request.isActive());
        return toResponse(organizationChartRepository.save(chart));
    }

    // 조직도 수정
    public OrganizationChartResponse updateOrganizationChart(Long id, OrganizationChartRequest request){
        OrganizationChart organizationChart = organizationChartRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("조직도를 찾을 수 없습니다. id: " + id));

        // 1. 파일 업데이트 (파일이 있을 때만)
        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            // 기존 파일 삭제
            if (organizationChart.getFilePath() != null) {
                fileUtil.deleteFile(organizationChart.getFilePath());
            }
            organizationChart.setFileName(request.getImageFile().getOriginalFilename());
            organizationChart.setFilePath(fileUtil.saveFile(request.getImageFile(), "organization-chart"));
        }

        // 2. 활성화 상태 관리 (항상 실행)
        if (request.isActive() && !organizationChart.isActive()) {
            OrganizationChart currentActive = organizationChartRepository.findByIsActiveTrue();
            if (currentActive != null && !currentActive.getId().equals(id)) {
                currentActive.setActive(false);
                organizationChartRepository.save(currentActive);
            }
        }

        // 3. 활성화 상태 업데이트 (항상 실행)
        organizationChart.setActive(request.isActive());

        // 4. 저장 및 반환
        return toResponse(organizationChartRepository.save(organizationChart));
    }

    public void deleteOrganizationChart(Long id) {
        OrganizationChart organizationChart = organizationChartRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("조직도를 찾을 수 없습니다. id: " + id));
        if(organizationChart.getFilePath() != null) {
            fileUtil.deleteFile(organizationChart.getFilePath());
        }
        if(organizationChart.isActive()) {
            throw new IllegalStateException("활성화된 조직도는 삭제할 수 없습니다.");
        }
        organizationChartRepository.delete(organizationChart);
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