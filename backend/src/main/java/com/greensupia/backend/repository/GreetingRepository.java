package com.greensupia.backend.repository;

import org.springframework.stereotype.Repository;
import com.greensupia.backend.entity.Greeting;

@Repository
public interface GreetingRepository extends EditorContentRepository {
    // 인사말만의 특별한 쿼리들이 필요하면 여기에 추가
    // 현재는 EditorContentRepository의 모든 기능을 그대로 사용
} 