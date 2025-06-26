package com.greensupia.backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.entity.EditorContent;
import com.greensupia.backend.repository.EditorContentRepository;
import com.greensupia.backend.dto.request.EditorContentRequest;
import com.greensupia.backend.dto.response.EditorContentResponse;
import com.greensupia.backend.dto.response.PageResponse;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EditorContentService {
    private final EditorContentRepository editorContentRepository;
    private final PaginationService paginationService;

    // 단일 활성 콘텐츠 조회 (인사말용)
    public EditorContentResponse getContent() {
        EditorContent content = editorContentRepository.findByIsActiveTrue()
        .orElseThrow(() -> new RuntimeException("활성화된 콘텐츠가 없습니다."));
        return convertToResponse(content);
    }

    // 전체 목록 조회 (페이지네이션)
    public PageResponse<EditorContentResponse> getAllContents(Pageable pageable) {
        Page<EditorContent> contentPage = editorContentRepository.findAll(pageable);
        Page<EditorContentResponse> responsePage = contentPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    // 전체 목록 조회 (리스트)
    public List<EditorContentResponse> getAllContents() {
        return editorContentRepository.findAll().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    // 활성 목록 조회 (페이지네이션)
    public PageResponse<EditorContentResponse> getActiveContents(Pageable pageable) {
        Page<EditorContent> contentPage = editorContentRepository.findByIsActiveTrue(pageable);
        Page<EditorContentResponse> responsePage = contentPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    // 활성 목록 조회 (리스트)
    public List<EditorContentResponse> getActiveContents() {
        return editorContentRepository.findAllByIsActiveTrue().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public EditorContentResponse getContentById(Long id) {
        EditorContent content = editorContentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("콘텐츠를 찾을 수 없습니다."));
        return convertToResponse(content);
    }

    @Transactional
    public EditorContentResponse createContent(EditorContentRequest request) {
        EditorContent content = new EditorContent();
        updateContentFromRequest(content, request);
        return convertToResponse(editorContentRepository.save(content));
    }

    @Transactional
    public EditorContentResponse updateContent(Long id, EditorContentRequest request) {
        EditorContent content = editorContentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("콘텐츠를 찾을 수 없습니다."));
        updateContentFromRequest(content, request);
        return convertToResponse(content);
    }

    @Transactional
    public void deleteContent(Long id) {
        editorContentRepository.deleteById(id);
    }

    @Transactional
    public void toggleContentStatus(Long id) {
        EditorContent content = editorContentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("콘텐츠를 찾을 수 없습니다."+id));

        if(!content.getIsActive()) {
            editorContentRepository.findAllByIsActiveTrue()
            .forEach(c -> c.setIsActive(false));
        }
        content.setIsActive(!content.getIsActive());
        editorContentRepository.save(content);
    }

    private EditorContentResponse convertToResponse(EditorContent content) {
        EditorContentResponse response = new EditorContentResponse();
        response.setId(content.getId());
        response.setTitle(content.getTitle());
        response.setContent(content.getContent());
        response.setIsActive(content.getIsActive());
        response.setCreatedAt(content.getCreatedAt());
        response.setUpdatedAt(content.getUpdatedAt());
        return response;
    } 

    private void updateContentFromRequest(EditorContent content, EditorContentRequest request) {
        content.setTitle(request.getTitle());
        content.setContent(request.getContent());
        content.setIsActive(request.getIsActive());
    }
}