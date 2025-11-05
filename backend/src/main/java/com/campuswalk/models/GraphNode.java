package com.campuswalk.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "graph_nodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphNode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal lat;
    
    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal lng;
    
    @Column(name = "node_type")
    private String nodeType = "junction"; // junction, pathway, entrance
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
