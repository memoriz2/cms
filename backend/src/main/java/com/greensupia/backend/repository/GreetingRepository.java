package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.greensupia.backend.entity.Greeting;

@Repository
public interface GreetingRepository extends JpaRepository<Greeting, Long> {
    // 인사말만의 특별한 쿼리들이 필요하면 여기에 추가
} 