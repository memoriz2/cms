package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.greensupia.backend.entity.Greeting;
import java.util.List;

@Repository
public interface GreetingRepository extends JpaRepository<Greeting, Long> {
    // 활성화된 인사말 목록 조회
    List<Greeting> findByIsActiveTrue();
    
    // 인사말만의 특별한 쿼리들이 필요하면 여기에 추가
} 