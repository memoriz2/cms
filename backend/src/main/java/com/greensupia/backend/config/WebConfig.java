package com.greensupia.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://139.150.73.107:3000",
                "http://139.150.73.107:3001",
                "http://www.jseo.shop",
                "http://portal.jseo.shop",
                "https://www.jseo.shop",
                "https://portal.jseo.shop"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 현재 작업 디렉토리의 절대 경로 사용
        String currentDir = System.getProperty("user.dir");
        String uploadPath = currentDir + File.separator + "uploads";
        
        // 업로드된 파일들을 정적 리소스로 서빙
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + File.separator);
        
        System.out.println("=== WebConfig loaded: Static resource handler configured ===");
        System.out.println("Current directory: " + currentDir);
        System.out.println("Upload path: " + uploadPath);
        System.out.println("Resource handler: /uploads/** -> file:" + uploadPath + File.separator);
    }
} 