package com.greensupia.backend.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.UUID;

@Component
public class FileUtil {
    
    /**
     * 파일 저장
     * @param file 저장할 파일
     * @param directory 저장할 디렉토리 (uploads 하위)
     * @return 저장된 파일 경로
     */
    public String saveFile(MultipartFile file, String directory) {
        try {
            // 디렉토리 생성
            String uploadDir = "uploads/" + directory;
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            // 파일 저장
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);
            
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage(), e);
        }
    }
    
    /**
     * 파일 삭제
     * @param filePath 삭제할 파일 경로
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + filePath + ", Error: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * 파일 존재 여부 확인
     * @param filePath 확인할 파일 경로
     * @return 파일 존재 여부
     */
    public boolean existsFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.exists(path);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 파일 크기 조회
     * @param filePath 파일 경로
     * @return 파일 크기 (바이트)
     */
    public long getFileSize(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.size(path);
        } catch (IOException e) {
            return 0;
        }
    }
} 