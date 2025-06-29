package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.greensupia.backend.dto.response.BannerNewsResponse;
import com.greensupia.backend.service.BannerNewsService;


@RestController
@RequestMapping("/api/banner-news")
public class BannerNewsUserController {
    @Autowired
    private BannerNewsService bannerNewsService;

    // 활성화된 배너 뉴스 최대 N개 조회(기본 4개)
    @GetMapping("/active")
    public List<BannerNewsResponse> getActiveBannerNews(@RequestParam(defaultValue = "4") int limit){
        return bannerNewsService.getActiveBannerNews(limit);
    }
}
