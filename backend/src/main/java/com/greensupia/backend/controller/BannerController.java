package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import com.greensupia.backend.dto.response.PageResponse;
import com.greensupia.backend.dto.response.BannerResponse;
import com.greensupia.backend.dto.request.BannerRequest;
import com.greensupia.backend.service.BannerService;
import lombok.RequiredArgsConstructor;
import java.net.URI;


@RestController
@RequestMapping("/api/portal/banners")
@RequiredArgsConstructor
public class BannerController extends BaseController {
    private final BannerService bannerService;

    // 목록 조회
    @GetMapping
    public ResponseEntity<PageResponse<BannerResponse>> getAllBanners(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sort,
        @RequestParam(defaultValue = "desc") String sortDir
    ){
        Pageable pageable = createPageable(page, size, sort, sortDir);
        PageResponse<BannerResponse> response = bannerService.getAllBanners(pageable);
        return ResponseEntity.ok(response);
    }
    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BannerResponse> getBanner(@PathVariable Long id){
        BannerResponse response = bannerService.getBanner(id);
        return ResponseEntity.ok(response);
    }

    // 추가 (파일 업로드 지원)
    @PostMapping
    public ResponseEntity<BannerResponse> createBanner(
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam(value = "isActive", defaultValue = "false") boolean isActive
    ){
        BannerResponse response;
        if (file != null && !file.isEmpty()) {
            // 파일이 있으면 파일과 함께 저장
            response = bannerService.createBannerWithFile(file, title, isActive);
        } else {
            // 파일이 없으면 텍스트만 저장
            response = bannerService.createBanner(title, isActive);
        }
        return ResponseEntity.created(URI.create("/api/portal/banners/" + response.getId()))
                .body(response);
    }

    // 수정 (파일 업로드 지원)
    @PutMapping("/{id}")
    public ResponseEntity<BannerResponse> updateBanner(
        @PathVariable Long id,
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam(value = "isActive", defaultValue = "false") boolean isActive
    ){
        BannerResponse response;
        if (file != null && !file.isEmpty()) {
            // 파일이 있으면 파일과 함께 수정
            response = bannerService.updateBannerWithFile(id, file, title, isActive);
        } else {
            // 파일이 없으면 텍스트만 수정
            response = bannerService.updateBanner(id, title, isActive);
        }
        return ResponseEntity.ok(response);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id){
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    // 활성화/비활성화
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleBanner(@PathVariable Long id){
        bannerService.toggleBannerStatus(id);
        return ResponseEntity.ok().build();
    }
}
