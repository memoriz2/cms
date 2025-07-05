package com.greensupia.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Value("${admin.url}")
    private String adminUrl;

    @Value("${user.url}")
    private String userUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**", "/uploads/**")  // 보안 적용 범위 명시
            .authorizeHttpRequests(authz -> authz
                // 관리자용 API - 인증 필요 (현재는 개발용으로 permitAll)
                .requestMatchers("/api/portal/**").permitAll()
                
                // 사용자용 API - 인증 없이 접근 가능
                .requestMatchers("/api/organization-charts/**").permitAll()
                .requestMatchers("/api/banners/**").permitAll()
                .requestMatchers("/api/videos/**").permitAll()
                .requestMatchers("/api/greetings/**").permitAll()
                .requestMatchers("/api/histories/**").permitAll()
                .requestMatchers("/api/banner-news/**").permitAll()
                
                // 정적 리소스
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/uploads/**").permitAll()
                
                // 나머지는 인증 필요
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())  // API 서버는 CSRF 불필요
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 도메인 설정
        configuration.setAllowedOriginPatterns(Arrays.asList(
            adminUrl, 
            userUrl,
            "http://localhost:3000",
            "http://localhost:3001"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);  // CORS preflight 캐시 시간
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 