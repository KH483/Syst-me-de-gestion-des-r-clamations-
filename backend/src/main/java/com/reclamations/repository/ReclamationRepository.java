package com.reclamations.repository;

import com.reclamations.entity.Reclamation;
import com.reclamations.entity.StatutReclamation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    Page<Reclamation> findByStatut(StatutReclamation statut, Pageable pageable);

    Page<Reclamation> findByClientId(Long clientId, Pageable pageable);

    Page<Reclamation> findByAgentId(Long agentId, Pageable pageable);

    List<Reclamation> findByStatut(StatutReclamation statut);

    @Query("SELECT r FROM Reclamation r WHERE r.client.user.id = :userId")
    Page<Reclamation> findByClientUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT r.statut, COUNT(r) FROM Reclamation r GROUP BY r.statut")
    List<Object[]> countByStatut();

    @Query("SELECT AVG(r.note) FROM Reclamation r WHERE r.note IS NOT NULL")
    Double averageNote();

    @Query("SELECT COUNT(r) FROM Reclamation r WHERE r.note IS NOT NULL")
    Long countWithNote();

    Long countByAgentId(Long agentId);

    Long countByAgentIdAndStatut(Long agentId, StatutReclamation statut);

    @Query("SELECT AVG(r.note) FROM Reclamation r WHERE r.agent.id = :agentId AND r.note IS NOT NULL")
    Double averageNoteByAgentId(@Param("agentId") Long agentId);
}
