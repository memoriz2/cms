package com.greensupia.backend.service;

import org.springframework.stereotype.Service;

import com.greensupia.backend.dto.request.BannerNewsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.stream.Collectors;
import com.greensupia.backend.dto.response.BannerNewsResponse;
import com.greensupia.backend.repository.BannerNewsRepository;
import com.greensupia.backend.entity.BannerNews;

@Service
public class BannerNewsService {
    
    @Autowired
    private BannerNewsRepository bannerNewsRepository;

    // 활성화된 배너 뉴스 최대 N개 조회
    // 사용자용
    public List<BannerNewsResponse> getActiveBannerNews(int limit){
        Pageable pageable = PageRequest.of(0, limit);
        return bannerNewsRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // 관리자용
    public Page<BannerNewsResponse> getAllBannerNews(Pageable pageable){
        return bannerNewsRepository.findAll(pageable)
        .map(this::toResponse);
    }

    // 등록
    public BannerNewsResponse create(BannerNewsRequest request){
        BannerNews bannerNews = new BannerNews();
        bannerNews.setTitle(request.getTitle());
        bannerNews.setSource(request.getSource());
        bannerNews.setImagePath(request.getImagePath());
        bannerNews.setLinkUrl(request.getLinkUrl());
        bannerNews.setActive(request.isActive());
        bannerNewsRepository.save(bannerNews);
        return toResponse(bannerNews);
    }

    // 수정
    public BannerNewsResponse update(Long id, BannerNewsRequest request){
        BannerNews news = bannerNewsRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("존재하지 않는 배너 뉴스입니다."));
        news.setTitle(request.getTitle());
        news.setSource(request.getSource());
        news.setImagePath(request.getImagePath());
        news.setLinkUrl(request.getLinkUrl());
        news.setActive(request.isActive());
        bannerNewsRepository.save(news);
        return toResponse(news);
    }

    // 삭제
    public void delete(Long id){

        if(!bannerNewsRepository.existsById(id)){
            throw new RuntimeException("존재하지 않는 배너 뉴스입니다.");
        }
        bannerNewsRepository.deleteById(id);
    }

    // 활성화/비활성화 토글
    public BannerNewsResponse toggleActive(Long id, boolean isActive){
        BannerNews news = bannerNewsRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("존재하지 않는 배너 뉴스입니다."));
        news.setActive(isActive);
        bannerNewsRepository.save(news);
        return toResponse(news);
    }

    // 엔티티 -> 응답 DTO 변환
    private BannerNewsResponse toResponse(BannerNews news){
        BannerNewsResponse dto = new BannerNewsResponse();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setSource(news.getSource());
        dto.setImagePath(news.getImagePath());
        dto.setLinkUrl(news.getLinkUrl());
        dto.setActive(news.isActive());
        dto.setCreatedAt(news.getCreatedAt());
        return dto;
    }
}
