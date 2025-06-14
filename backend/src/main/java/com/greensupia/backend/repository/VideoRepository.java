package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greensupia.backend.entity.Video;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long>{
    List<Video> findByIsActiveTrue();
}
