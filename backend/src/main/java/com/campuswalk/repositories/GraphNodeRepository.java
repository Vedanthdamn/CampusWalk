package com.campuswalk.repositories;

import com.campuswalk.models.GraphNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraphNodeRepository extends JpaRepository<GraphNode, Long> {
}
