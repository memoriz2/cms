package com.greensupia.backend.service;

import com.greensupia.backend.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.greensupia.backend.dto.request.HistoryRequest;
import com.greensupia.backend.dto.response.HistoryResponse;
import com.greensupia.backend.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;

@Service
public class HistoryService {
    
    @Autowired
    private HistoryRepository historyRepository;
    
    // 활성화된 연혁 조회(연도별 정렬)
    public List<HistoryResponse> getActiveHistories() {
        return historyRepository.findByIsActiveTrueOrderByYearDescSortOrderAsc()
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
    }

    // 특정 연도의 활성화된 연혁 조회
    public List<HistoryResponse> getActiveHistoriesByYear(String year) {

        return historyRepository.findByYearAndIsActiveTrueOrderBySortOrderAsc(year)
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
    }

    // 전체 연혁 페이징 조회
    public Page<HistoryResponse> getAllHistories(Pageable pageable) {
        return historyRepository.findAll(pageable)
        .map(this::toResponse);
    }

    // 활성화된 연혁 페이징 조회
    public Page<HistoryResponse> getActiveHistories(Pageable pageable) {
        return historyRepository.findByIsActiveTrue(pageable)
        .map(this::toResponse);
    }

    // 연혁 생성
    public HistoryResponse createHistory(HistoryRequest request) {
        History history = History.builder()
        .year(request.getYear())
        .description(request.getDescription())
        .sortOrder(request.getSortOrder())
        .isActive(request.getIsActive())
        .build();
        return toResponse(historyRepository.save(history));
    }

    // 연혁 수정
    public HistoryResponse updateHistory(Long id, HistoryRequest request) {

        History history = historyRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 연혁입니다. id: " + id));

        history.setYear(request.getYear());
        history.setDescription(request.getDescription());
        history.setSortOrder(request.getSortOrder());
        history.setIsActive(request.getIsActive());
        return toResponse(historyRepository.save(history));
    }

    // 연혁 삭제
    public void deleteHistory(Long id) {
        if(!historyRepository.existsById(id)) {
            throw new EntityNotFoundException("존재하지 않는 연혁입니다. id: " + id);
        }
        historyRepository.deleteById(id);
    }

    // 활성화/비활성화 토글
    public HistoryResponse toggleActive(Long id, Boolean isActive) {

        History history = historyRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 연혁입니다. id: " + id));
        history.setIsActive(isActive);
        return toResponse(historyRepository.save(history));
    }

    // Entity -> Response 변환
    private HistoryResponse toResponse(History history) {
        HistoryResponse response = new HistoryResponse();
        response.setId(history.getId());
        response.setYear(history.getYear());
        response.setDescription(history.getDescription());
        response.setSortOrder(history.getSortOrder());
        response.setIsActive(history.getIsActive());
        response.setCreatedAt(history.getCreatedAt());
        return response;
    }
} 