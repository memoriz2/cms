package com.greensupia.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${admin.url}")
    private String adminUrl;

    @Value("${user.url}")
    private String userUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests()
                // TODO: 인증 시스템 구현 후 활성화
                // .requestMatchers("/api/portal/**").hasRole("CONTENT_MANAGER")
                .requestMatchers("/api/portal/**").permitAll()  // 임시로 모든 요청 허용
                .requestMatchers("/api/videos/**").permitAll()
                .requestMatchers("/api/banners/**").permitAll()  // 사용자용 배너 API 허용
                .requestMatchers("/api/greetings/**").permitAll()  // 사용자용 인사말 API 허용
                .requestMatchers("/uploads/**").permitAll()  // 정적 파일 접근 허용
                .requestMatchers("/api/banner-news/**").permitAll() // 사용자용 배너 뉴스 API 허용
                .anyRequest().authenticated();
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(adminUrl, userUrl));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 