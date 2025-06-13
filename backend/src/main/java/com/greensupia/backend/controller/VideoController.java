package com.greensupia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greensupia.backend.dto.request.VideoRequest;
import com.greensupia.backend.dto.response.VideoResponse;
import com.greensupia.backend.service.VideoService;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/portal/videos")
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    // 영상 목록 조회
    @GetMapping
    public ResponseEntity<List<VideoResponse>> getAllVideos(){
        return ResponseEntity.ok(videoService.getAllVideos());
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
