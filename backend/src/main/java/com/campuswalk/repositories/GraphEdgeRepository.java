package com.campuswalk.repositories;

import com.campuswalk.models.GraphEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GraphEdgeRepository extends JpaRepository<GraphEdge, Long> {
    List<GraphEdge> findByFromNode(Long fromNode);
    List<GraphEdge> findByToNode(Long toNode);
}
