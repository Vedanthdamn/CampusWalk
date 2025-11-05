package com.campuswalk.controllers;

import com.campuswalk.models.Hostel;
import com.campuswalk.repositories.HostelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hostels")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class HostelController {
    
    @Autowired
    private HostelRepository hostelRepository;
    
    /**
     * Get all hostels
     */
    @GetMapping
    public ResponseEntity<List<Hostel>> getAllHostels() {
        try {
            List<Hostel> hostels = hostelRepository.findAll();
            return ResponseEntity.ok(hostels);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get hostel by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Hostel> getHostelById(@PathVariable Long id) {
        return hostelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
