package com.greensupia.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "greetings")
public class Greeting extends EditorContent {
    // 인사말만의 특별한 필드들이 필요하면 여기에 추가
    // 현재는 EditorContent의 모든 기능을 그대로 사용
} 