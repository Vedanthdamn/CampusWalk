package com.campuswalk.controllers;

import com.campuswalk.models.Floor;
import com.campuswalk.repositories.FloorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/floors")
public class FloorController {
    
    @Autowired
    private FloorRepository floorRepository;
    
    @GetMapping
    public ResponseEntity<List<Floor>> getAllFloors() {
        List<Floor> floors = floorRepository.findAll();
        return ResponseEntity.ok(floors);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Floor> getFloorById(@PathVariable Long id) {
        return floorRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<Floor>> getFloorsByBuilding(@PathVariable Long buildingId) {
        List<Floor> floors = floorRepository.findByBuildingId(buildingId);
        return ResponseEntity.ok(floors);
    }
}
