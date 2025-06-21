package com.greensupia.backend.service;

import com.greensupia.backend.entity.Banner;
import com.greensupia.backend.dto.response.BannerResponse;
import com.greensupia.backend.dto.response.PageResponse;
import com.greensupia.backend.util.FileUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.greensupia.backend.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerService {
    private final BannerRepository bannerRepository;
    private final PaginationService paginationService;
    private final FileUtil fileUtil;

    // 배너 업로드 (텍스트만)
    @Transactional
    public BannerResponse createBanner(String title, boolean isActive){
        Banner banner = Banner.builder()
            .title(title)
            .fileName("")
            .filePath("")
            .isActive(isActive)
            .build();
        return convertToResponse(bannerRepository.save(banner));
    }

    // 배너 업로드 (파일 포함)
    @Transactional
    public BannerResponse createBannerWithFile(MultipartFile file, String title, boolean isActive){
        // 파일 저장
        String fileName = file.getOriginalFilename();
        String filePath = fileUtil.saveFile(file, "banners");
        
        Banner banner = Banner.builder()
            .title(title)
            .fileName(fileName)
            .filePath(filePath)
            .isActive(isActive)
            .build();
        return convertToResponse(bannerRepository.save(banner));
    }

    // 배너 목록 조회(페이징)
    public PageResponse<BannerResponse> getAllBanners(Pageable pageable){   
        Page<Banner> bannerPage = bannerRepository.findAll(pageable);
        Page<BannerResponse> responsePage = bannerPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    // 활성화된 배너 목록 조회(페이징)
    public PageResponse<BannerResponse> getActiveBanners(Pageable pageable){
        Page<Banner> bannerPage = bannerRepository.findByIsActiveTrue(pageable);
        Page<BannerResponse> responsePage = bannerPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    // 활성화된 배너 중 첫 번째 배너 조회 (사용자용)
    public BannerResponse getFirstActiveBanner(){
        Banner activeBanner = bannerRepository.findFirstByIsActiveTrueOrderByCreatedAtDesc()
            .orElseThrow(() -> new EntityNotFoundException("No active banner found"));
        return convertToResponse(activeBanner);
    }

    // 배너 상세 조회
    public BannerResponse getBanner(Long id){
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(()->new EntityNotFoundException("Banner not found with id: " + id));
        return convertToResponse(banner);
    }

    // 배너 수정 (텍스트만)
    @Transactional
    public BannerResponse updateBanner(Long id, String title, boolean isActive){
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(()->new EntityNotFoundException("Banner not found with id: " + id));
        
        banner.setTitle(title);
        banner.setIsActive(isActive);
        return convertToResponse(bannerRepository.save(banner));
    }

    // 배너 수정 (파일 포함)
    @Transactional
    public BannerResponse updateBannerWithFile(Long id, MultipartFile file, String title, boolean isActive){
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(()->new EntityNotFoundException("Banner not found with id: " + id));
        
        // 기존 파일 삭제
        if (banner.getFilePath() != null && !banner.getFilePath().isEmpty()) {
            fileUtil.deleteFile(banner.getFilePath());
        }
        
        // 새 파일 저장
        String fileName = file.getOriginalFilename();
        String filePath = fileUtil.saveFile(file, "banners");
        
        banner.setTitle(title);
        banner.setFileName(fileName);
        banner.setFilePath(filePath);
        banner.setIsActive(isActive);
        
        return convertToResponse(bannerRepository.save(banner));
    }

    // 배너 삭제
    @Transactional
    public void deleteBanner(Long id){
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(()->new EntityNotFoundException("Banner not found with id: " + id));

        //실제 파일도 삭제
        fileUtil.deleteFile(banner.getFilePath());

        // 파일 삭제
        bannerRepository.deleteById(id);
    }

    // Entity를 Response DTO로 변환
    private BannerResponse convertToResponse(Banner banner){
        BannerResponse response = new BannerResponse();
        response.setId(banner.getId());
        response.setTitle(banner.getTitle());
        response.setFileName(banner.getFileName());
        response.setFilePath(banner.getFilePath());
        response.setIsActive(banner.getIsActive());
        response.setCreatedAt(banner.getCreatedAt());
        response.setUpdatedAt(banner.getUpdatedAt());
        return response;
    }
    
    // 배너 활성화/비활성화
    @Transactional
    public void toggleBannerStatus(Long id){
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(()->new EntityNotFoundException("Banner not found with id: " + id));

        if(!banner.getIsActive()){
            bannerRepository.findByIsActiveTrue()
                .forEach(b -> b.setIsActive(false));
        }
        banner.setIsActive(!banner.getIsActive());
        bannerRepository.save(banner);
    }
}
