package com.campuswalk.controllers;

import com.campuswalk.dto.RouteResponse;
import com.campuswalk.services.PathfindingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/navigation")
public class NavigationController {
    
    @Autowired
    private PathfindingService pathfindingService;
    
    /**
     * Find shortest path between two locations
     * GET /api/navigation/route?from=1&to=20
     */
    @GetMapping("/route")
    public ResponseEntity<RouteResponse> findRoute(
        @RequestParam Long from,
        @RequestParam Long to
    ) {
        RouteResponse response = pathfindingService.findShortestPath(from, to);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
