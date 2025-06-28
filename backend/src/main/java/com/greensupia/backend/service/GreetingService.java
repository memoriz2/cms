package com.greensupia.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.greensupia.backend.entity.Greeting;
import com.greensupia.backend.repository.GreetingRepository;
import com.greensupia.backend.dto.request.EditorContentRequest;
import com.greensupia.backend.dto.response.EditorContentResponse;
import com.greensupia.backend.dto.response.PageResponse;
import java.util.List;
import java.util.Optional;

@Service
public class GreetingService {
    private final GreetingRepository greetingRepository;
    private final PaginationService paginationService;

    public GreetingService(GreetingRepository greetingRepository, PaginationService paginationService) {
        this.greetingRepository = greetingRepository;
        this.paginationService = paginationService;
    }

    public PageResponse<EditorContentResponse> getGreetings(Pageable pageable) {
        Page<Greeting> greetingPage = greetingRepository.findAll(pageable);
        Page<EditorContentResponse> responsePage = greetingPage.map(this::convertToResponse);
        return paginationService.convertToPageResponse(responsePage);
    }

    public EditorContentResponse createGreeting(EditorContentRequest request) {
        Greeting greeting = new Greeting();
        greeting.setTitle(request.getTitle());
        greeting.setContent(request.getContent());
        greeting.setIsActive(request.getIsActive());
        
        Greeting savedGreeting = greetingRepository.save(greeting);
        return convertToResponse(savedGreeting);
    }

    public EditorContentResponse updateGreeting(Long id, EditorContentRequest request) {
        System.out.println("=== updateGreeting 메서드 호출 ===");
        System.out.println("수정할 ID: " + id);
        System.out.println("요청 데이터 - 제목: " + request.getTitle());
        System.out.println("요청 데이터 - 내용: " + request.getContent());
        System.out.println("요청 데이터 - 활성화: " + request.getIsActive());
        
        Optional<Greeting> optionalGreeting = greetingRepository.findById(id);
        if (optionalGreeting.isPresent()) {
            Greeting greeting = optionalGreeting.get();
            System.out.println("기존 데이터 - 제목: " + greeting.getTitle());
            System.out.println("기존 데이터 - 내용: " + greeting.getContent());
            System.out.println("기존 데이터 - 활성화: " + greeting.getIsActive());
            
            greeting.setTitle(request.getTitle());
            greeting.setContent(request.getContent());
            greeting.setIsActive(request.getIsActive());
            
            System.out.println("업데이트 후 데이터 - 제목: " + greeting.getTitle());
            System.out.println("업데이트 후 데이터 - 내용: " + greeting.getContent());
            System.out.println("업데이트 후 데이터 - 활성화: " + greeting.getIsActive());
            
            Greeting updatedGreeting = greetingRepository.save(greeting);
            System.out.println("저장 완료 - ID: " + updatedGreeting.getId());
            
            return convertToResponse(updatedGreeting);
        }
        System.out.println("Greeting을 찾을 수 없음 - ID: " + id);
        throw new RuntimeException("Greeting not found with id: " + id);
    }

    public void deleteGreeting(Long id) {
        greetingRepository.deleteById(id);
    }

    public EditorContentResponse getGreeting(Long id) {
        Optional<Greeting> optionalGreeting = greetingRepository.findById(id);
        if (optionalGreeting.isPresent()) {
            return convertToResponse(optionalGreeting.get());
        }
        throw new RuntimeException("Greeting not found with id: " + id);
    }

    public EditorContentResponse getFirstActiveGreeting() {
        List<Greeting> activeGreetings = greetingRepository.findByIsActiveTrue();
        if (activeGreetings.isEmpty()) {
            throw new RuntimeException("활성화된 인사말이 없습니다.");
        }
        return convertToResponse(activeGreetings.get(0));
    }

    private EditorContentResponse convertToResponse(Greeting greeting) {
        EditorContentResponse response = new EditorContentResponse();
        response.setId(greeting.getId());
        response.setTitle(greeting.getTitle());
        response.setContent(greeting.getContent());
        response.setIsActive(greeting.getIsActive());
        response.setCreatedAt(greeting.getCreatedAt());
        response.setUpdatedAt(greeting.getUpdatedAt());
        return response;
    }
} 