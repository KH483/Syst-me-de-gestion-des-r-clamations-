package com.reclamations.repository;

import com.reclamations.entity.AgentSAV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgentSAVRepository extends JpaRepository<AgentSAV, Long> {
    Optional<AgentSAV> findByUserUsername(String username);
}
