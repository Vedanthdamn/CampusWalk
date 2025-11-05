package com.campuswalk.controllers;

import com.campuswalk.models.Building;
import com.campuswalk.repositories.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BuildingController {
    
    @Autowired
    private BuildingRepository buildingRepository;
    
    /**
     * Get all buildings
     */
    @GetMapping
    public ResponseEntity<List<Building>> getAllBuildings() {
        try {
            List<Building> buildings = buildingRepository.findAll();
            return ResponseEntity.ok(buildings);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get building by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Building> getBuildingById(@PathVariable Long id) {
        return buildingRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
