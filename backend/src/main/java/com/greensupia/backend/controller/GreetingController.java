package com.greensupia.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.service.GreetingService;
import com.greensupia.backend.dto.request.EditorContentRequest;
import com.greensupia.backend.dto.response.EditorContentResponse;
import com.greensupia.backend.dto.response.PageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.greensupia.backend.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/greetings")
@RequiredArgsConstructor
public class GreetingController extends BaseController {
    
    private final GreetingService greetingService;

    @Autowired
    private FileUtil fileUtil;

    @GetMapping("/list")
    public PageResponse<EditorContentResponse> getGreetings(Pageable pageable) {
        return greetingService.getGreetings(pageable);
    }

    @PostMapping
    public EditorContentResponse createGreeting(@RequestBody EditorContentRequest request) {
        return greetingService.createGreeting(request);
    }

    @PutMapping("/{id}")
    public EditorContentResponse updateGreeting(@PathVariable Long id, @RequestBody EditorContentRequest request) {
        return greetingService.updateGreeting(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteGreeting(@PathVariable Long id) {
        greetingService.deleteGreeting(id);
    }

    @GetMapping("/{id}")
    public EditorContentResponse getGreeting(@PathVariable Long id) {
        return greetingService.getGreeting(id);
    }

    // 이미지 업로드 엔드포인트
    @PostMapping("/upload")
    public ResponseEntity<?> uploadGreetingImage(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일이 없습니다."));
        }
        String filePath = fileUtil.saveFile(file, "board");
        String url = "/" + filePath.replace("\\", "/");
        return ResponseEntity.ok(Map.of("url", url));
    }
} 