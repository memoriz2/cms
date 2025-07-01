package com.greensupia.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.dto.request.BannerNewsRequest;
import com.greensupia.backend.dto.response.BannerNewsResponse;
import com.greensupia.backend.service.BannerNewsService;

@RestController
@RequestMapping("/api/portal/banner-news")
public class BannerNewsController {
    @Autowired
    private BannerNewsService bannerNewsService;

    @GetMapping
    public Page<BannerNewsResponse> getAllBannerNews(Pageable pageable){
        return bannerNewsService.getAllBannerNews(pageable);
    }

    @PostMapping
    public BannerNewsResponse create(@RequestBody BannerNewsRequest request){
        return bannerNewsService.create(request);
    }

    @PutMapping("/{id}")
    public BannerNewsResponse update(@PathVariable Long id, @RequestBody BannerNewsRequest request){
        return bannerNewsService.update(id, request);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        bannerNewsService.delete(id);
    }

    @PutMapping("/{id}/active") 
    public BannerNewsResponse toggleActive(@PathVariable Long id, @RequestParam boolean isActive){
        System.out.println("=== BannerNews toggleActive called: id=" + id + ", isActive=" + isActive + " ===");
        BannerNewsResponse response = bannerNewsService.toggleActive(id, isActive);
        System.out.println("=== BannerNews toggleActive response: " + response + " ===");
        return response;
    }
    
    @GetMapping("/active-count")
    public long getActiveBannerNewsCount() {
        return bannerNewsService.getActiveBannerNewsCount();
    }
    
}
