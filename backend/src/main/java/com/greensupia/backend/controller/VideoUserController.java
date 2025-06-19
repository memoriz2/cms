package com.greensupia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.service.VideoService;
import java.util.List;

import com.greensupia.backend.dto.response.PageResponse;
import com.greensupia.backend.dto.response.VideoResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoUserController extends BaseController {
    private final VideoService videoService;

    //활성화된 영상 목록 조회
    @GetMapping("/active")
    public ResponseEntity<PageResponse<VideoResponse>> getActiveVideos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ){
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        PageResponse<VideoResponse> response = videoService.getActiveVideos(pageable);
        return ResponseEntity.ok(response);
    }

    // 영상 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getVideo(@PathVariable Long id){
        return ResponseEntity.ok(videoService.getVideo(id));
    }
}
