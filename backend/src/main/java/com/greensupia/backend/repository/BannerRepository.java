package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.greensupia.backend.entity.Banner;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByIsActiveTrue();
    Page<Banner> findAll(Pageable pageable);
    Page<Banner> findByIsActiveTrue(Pageable pageable);
    java.util.Optional<Banner> findFirstByIsActiveTrueOrderByCreatedAtDesc();
} 
