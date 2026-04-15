package com.reclamations.repository;

import com.reclamations.entity.SuiviReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuiviReclamationRepository extends JpaRepository<SuiviReclamation, Long> {
    List<SuiviReclamation> findByReclamationIdOrderByDateDesc(Long reclamationId);
}
