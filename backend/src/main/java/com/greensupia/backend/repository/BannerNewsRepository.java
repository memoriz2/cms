package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greensupia.backend.entity.BannerNews;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BannerNewsRepository extends JpaRepository<BannerNews, Long> {

    // 활성화된 배너 뉴스만 최신순으로 최대 N개 조회
    List<BannerNews> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    
    // 활성화된 배너 뉴스 개수 조회
    long countByIsActiveTrue();
}
