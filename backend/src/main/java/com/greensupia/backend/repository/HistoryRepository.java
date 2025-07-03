package com.greensupia.backend.repository;

import com.greensupia.backend.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    
    // 활성화된 연혁들을 연도 내림차순, 정렬순서 오름차순으로 조회
    List<History> findByIsActiveTrueOrderByYearDescSortOrderAsc();
    
    // 특정 연도의 활성화된 연혁들을 정렬순서 오름차순으로 조회
    List<History> findByYearAndIsActiveTrueOrderBySortOrderAsc(String year);
    
    // 활성화된 연혁들을 페이징으로 조회 (관리자용)
    Page<History> findByIsActiveTrue(Pageable pageable);
    
    // 전체 연혁을 페이징으로 조회 (관리자용)
    Page<History> findAll(Pageable pageable);
    
    // 활성화된 연혁 개수 조회
    long countByIsActiveTrue();
    
    // 특정 연도의 활성화된 연혁 개수 조회
    long countByYearAndIsActiveTrue(String year);
} 