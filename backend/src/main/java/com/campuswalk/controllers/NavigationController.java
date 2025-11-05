package com.campuswalk.controllers;

import com.campuswalk.dto.RouteNode;
import com.campuswalk.services.PathfindingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/navigation")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NavigationController {
    
    @Autowired
    private PathfindingService pathfindingService;
    
    /**
     * Find shortest outdoor path between two nodes
     * GET /api/navigation?from={nodeId}&to={nodeId}
     */
    @GetMapping
    public ResponseEntity<List<RouteNode>> findRoute(
        @RequestParam Long from,
        @RequestParam Long to
    ) {
        try {
            List<RouteNode> route = pathfindingService.findShortestPath(from, to);
            
            if (route.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(route);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
