package com.campuswalk.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "floor_id")
    @JsonIgnore
    private Floor floor;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private BigDecimal x;
    
    @Column(nullable = false)
    private BigDecimal y;
    
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
