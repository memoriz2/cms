package com.greensupia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import com.greensupia.backend.dto.request.EditorContentRequest;
import com.greensupia.backend.dto.response.EditorContentResponse;
import com.greensupia.backend.dto.response.PageResponse;
import com.greensupia.backend.service.EditorContentService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/portal/editor-contents")
@RequiredArgsConstructor
public class EditorContentController extends BaseController {
    private final EditorContentService editorContentService;

    // 단일 활성 콘텐츠 조회 (인사말용)
    @GetMapping
    public ResponseEntity<EditorContentResponse> getContent() {
        EditorContentResponse response = editorContentService.getContent();
        return ResponseEntity.ok(response);
    }

    // 전체 목록 조회 (페이지네이션)
    @GetMapping("/list")
    public ResponseEntity<PageResponse<EditorContentResponse>> getAllContents(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        PageResponse<EditorContentResponse> response = editorContentService.getAllContents(pageable);
        return ResponseEntity.ok(response);
    }

    // 전체 목록 조회 (리스트)
    @GetMapping("/all")
    public ResponseEntity<List<EditorContentResponse>> getAllContentsList() {
        List<EditorContentResponse> response = editorContentService.getAllContents();
        return ResponseEntity.ok(response);
    }

    // 활성 목록 조회 (페이지네이션)
    @GetMapping("/active/list")
    public ResponseEntity<PageResponse<EditorContentResponse>> getActiveContents(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        PageResponse<EditorContentResponse> response = editorContentService.getActiveContents(pageable);
        return ResponseEntity.ok(response);
    }

    // 활성 목록 조회 (리스트)
    @GetMapping("/active/all")
    public ResponseEntity<List<EditorContentResponse>> getActiveContentsList() {
        List<EditorContentResponse> response = editorContentService.getActiveContents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EditorContentResponse> getContentById(@PathVariable Long id) {
        return ResponseEntity.ok(editorContentService.getContentById(id));
    }

    @PostMapping
    public ResponseEntity<EditorContentResponse> createContent(@RequestBody EditorContentRequest request) {
        return ResponseEntity.ok(editorContentService.createContent(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EditorContentResponse> updateContent(@PathVariable Long id, @RequestBody EditorContentRequest request) {
        return ResponseEntity.ok(editorContentService.updateContent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        editorContentService.deleteContent(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleContent(@PathVariable Long id) { 
        editorContentService.toggleContentStatus(id);
        return ResponseEntity.ok().build();
    }
}
