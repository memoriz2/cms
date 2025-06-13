package com.greensupia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import com.greensupia.backend.service.VideoService;
import java.util.List;
import com.greensupia.backend.dto.response.VideoResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoUserController {
    private final VideoService videoService;

    //영상 목록 조회
    @GetMapping
    public ResponseEntity<List<VideoResponse>> getAllVideos(){
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    // 영상 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getVideo(@PathVariable Long id){
        return ResponseEntity.ok(videoService.getVideo(id));
    }
}
