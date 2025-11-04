package com.campuswalk.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "floors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Floor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "building_id")
    @JsonIgnore
    private Building building;
    
    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;
    
    @Column(name = "floor_name")
    private String floorName;
    
    @Column(name = "svg_url", nullable = false)
    private String svgUrl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL)
    private List<Location> locations;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
