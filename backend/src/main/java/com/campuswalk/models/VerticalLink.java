package com.campuswalk.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vertical_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerticalLink {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "from_location")
    private Location fromLocation;
    
    @ManyToOne
    @JoinColumn(name = "to_location")
    private Location toLocation;
    
    @Column(name = "vertical_type", nullable = false)
    private String verticalType;
    
    private BigDecimal weight;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
