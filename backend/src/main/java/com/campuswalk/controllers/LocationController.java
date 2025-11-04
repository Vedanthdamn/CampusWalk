package com.campuswalk.controllers;

import com.campuswalk.dto.LocationDTO;
import com.campuswalk.models.Location;
import com.campuswalk.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/locations")
public class LocationController {
    
    @Autowired
    private LocationRepository locationRepository;
    
    @GetMapping
    public ResponseEntity<List<LocationDTO>> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        List<LocationDTO> locationDTOs = locations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locationDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable Long id) {
        return locationRepository.findById(id)
            .map(this::convertToDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/floor/{floorId}")
    public ResponseEntity<List<LocationDTO>> getLocationsByFloor(@PathVariable Long floorId) {
        List<Location> locations = locationRepository.findByFloorId(floorId);
        List<LocationDTO> locationDTOs = locations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locationDTOs);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<LocationDTO>> searchLocations(@RequestParam String query) {
        List<Location> locations = locationRepository.searchLocations(query);
        List<LocationDTO> locationDTOs = locations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locationDTOs);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LocationDTO>> getLocationsByType(@PathVariable String type) {
        List<Location> locations = locationRepository.findByType(type);
        List<LocationDTO> locationDTOs = locations.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(locationDTOs);
    }
    
    private LocationDTO convertToDTO(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setType(location.getType());
        dto.setX(location.getX());
        dto.setY(location.getY());
        dto.setDescription(location.getDescription());
        dto.setFloorId(location.getFloor().getId());
        dto.setFloorNumber(location.getFloor().getFloorNumber());
        dto.setFloorName(location.getFloor().getFloorName());
        dto.setBuildingId(location.getFloor().getBuilding().getId());
        dto.setBuildingName(location.getFloor().getBuilding().getName());
        return dto;
    }
}
