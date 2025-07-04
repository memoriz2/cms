package com.greensupia.backend.repository;

import com.greensupia.backend.entity.OrganizationChart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface OrganizationChartRepository extends JpaRepository<OrganizationChart, Long> {
    
    //활성화된 조직도 조회(하나만 있으므로)
    OrganizationChart findByIsActiveTrue();

    //활성화된 조직도 존재 여부 확인
    boolean existsByIsActiveTrue();

}