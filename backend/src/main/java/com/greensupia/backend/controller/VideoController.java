package com.greensupia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Pageable;

import com.greensupia.backend.dto.request.VideoRequest;
import com.greensupia.backend.dto.response.PageResponse;
import com.greensupia.backend.dto.response.VideoResponse;
import com.greensupia.backend.service.VideoService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/portal/videos")
@RequiredArgsConstructor
public class VideoController extends BaseController {
    private final VideoService videoService;

    // 영상 목록 조회
    @GetMapping
    public ResponseEntity<PageResponse<VideoResponse>> getAllVideos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ){
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        PageResponse<VideoResponse> response = videoService.getAllVideos(pageable);
        return ResponseEntity.ok(response);
    }

    // 영상 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getVideo(@PathVariable Long id){
        return ResponseEntity.ok(videoService.getVideo(id));
    }

    // 영상 추가
    @PostMapping
    public ResponseEntity<VideoResponse> createVideo(@RequestBody VideoRequest request){
        return ResponseEntity.ok(videoService.createVideo(request));
    }

    // 영상 수정
    @PutMapping("/{id}")
    public ResponseEntity<VideoResponse> updateVideo(@PathVariable Long id, @RequestBody VideoRequest request){
        return ResponseEntity.ok(videoService.updateVideo(id, request));
    }

    // 영상 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id){
        videoService.deleteVideo(id);
        return ResponseEntity.ok().build();
    }
    
}
