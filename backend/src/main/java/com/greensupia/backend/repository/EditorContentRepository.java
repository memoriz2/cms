package com.greensupia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.greensupia.backend.entity.EditorContent;
import java.util.List;
import java.util.Optional;

@Repository
public interface EditorContentRepository extends JpaRepository<EditorContent, Long>{
    Optional<EditorContent> findByIsActiveTrue();
    List<EditorContent> findAllByIsActiveTrue();
    Page<EditorContent> findAll(Pageable pageable);
    Page<EditorContent> findByIsActiveTrue(Pageable pageable);
}
