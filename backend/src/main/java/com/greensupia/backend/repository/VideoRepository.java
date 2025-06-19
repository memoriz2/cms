package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.greensupia.backend.entity.Video;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long>{
    List<Video> findByIsActiveTrue();
    Page<Video> findAll(Pageable pageable);
    Page<Video> findByIsActiveTrue(Pageable pageable);
}
