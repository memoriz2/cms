package com.greensupia.backend.service;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.greensupia.backend.repository.VideoRepository;
import com.greensupia.backend.dto.request.VideoRequest;
import com.greensupia.backend.dto.response.VideoResponse;
import com.greensupia.backend.dto.response.PageResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import com.greensupia.backend.entity.Video;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {
    private final VideoRepository videoRepository;

    // 영상 목록 조회
    public List<VideoResponse> getAllVideos(){
        return videoRepository.findAll().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    // 활성화된 영상만 조회
    public List<VideoResponse> getActiveVideos() {
        return videoRepository.findByIsActiveTrue().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    private final PaginationService paginationService;

    // 모든 영상을 페이징으로 조회
    public PageResponse<VideoResponse> getAllVideos(Pageable pageable){
        Page<Video> videoPage = videoRepository.findAll(pageable);
        Page<VideoResponse> responsePage = videoPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    public PageResponse<VideoResponse> getActiveVideos(Pageable pageable){
        Page<Video> videoPage = videoRepository.findByIsActiveTrue(pageable);
        Page<VideoResponse> responsePage = videoPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    // 영상 상세 조회
    public VideoResponse getVideo(Long id){
        Video video = videoRepository.findById(id)
            .orElseThrow(()->new RuntimeException("Video not found"));
        return convertToResponse(video);
    }

    // 영상 추가
    @Transactional
    public VideoResponse createVideo(VideoRequest request){
        Video video = new Video();
        updateVideoFromRequest(video, request);
        // display_order가 null이면 기본값 0 설정
        if (video.getDisplayOrder() == null) {
            video.setDisplayOrder(0);
        }
        return convertToResponse(videoRepository.save(video));
    }

    // 영상 수정
    @Transactional
    public VideoResponse updateVideo(Long id, VideoRequest request){
        Video video = videoRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Video not found"));
        updateVideoFromRequest(video, request);
        return convertToResponse(video);
    }

    // 영상 삭제
    @Transactional
    public void deleteVideo(Long id){
        videoRepository.deleteById(id);
    }

    // Entity를 Response DTO로 변환환
    private VideoResponse convertToResponse(Video video){
        VideoResponse response = new VideoResponse();
        response.setId(video.getId());
        response.setTitle(video.getTitle());
        response.setDescription(video.getDescription());
        response.setYoutubeUrl(video.getYoutubeUrl());
        response.setDisplayOrder(video.getDisplayOrder());
        response.setIsActive(video.getIsActive());
        response.setCreatedAt(video.getCreatedAt());
        response.setUpdatedAt(video.getUpdatedAt());
        return response;
    }

    // Request DTO의 데이터로 Entity 업데이트
    private void updateVideoFromRequest(Video video, VideoRequest request){
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setYoutubeUrl(request.getYoutubeUrl());
        video.setDisplayOrder(request.getDisplayOrder());
        video.setIsActive(request.getIsActive());
    }

    
}
