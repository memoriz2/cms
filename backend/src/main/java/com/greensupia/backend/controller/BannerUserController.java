package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.greensupia.backend.dto.response.BannerResponse;
import com.greensupia.backend.service.BannerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerUserController extends BaseController {
    private final BannerService bannerService;

    // 활성화된 배너 조회 (사용자용)
    @GetMapping("/active")
    public ResponseEntity<BannerResponse> getActiveBanner(){
        try {
            // 활성 배너 목록에서 첫 번째 배너만 반환
            BannerResponse activeBanner = bannerService.getFirstActiveBanner();
            return ResponseEntity.ok(activeBanner);
        } catch (Exception e) {
            // 활성 배너가 없으면 404 반환
            return ResponseEntity.notFound().build();
        }
    }
} 