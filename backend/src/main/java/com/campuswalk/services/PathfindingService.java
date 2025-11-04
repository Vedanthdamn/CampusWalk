package com.campuswalk.services;

import com.campuswalk.dto.NavigationInstruction;
import com.campuswalk.dto.PathNode;
import com.campuswalk.dto.RouteResponse;
import com.campuswalk.models.*;
import com.campuswalk.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PathfindingService {
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private EdgeRepository edgeRepository;
    
    @Autowired
    private VerticalLinkRepository verticalLinkRepository;
    
    /**
     * Find the shortest path between two locations using Dijkstra's algorithm
     */
    public RouteResponse findShortestPath(Long fromLocationId, Long toLocationId) {
        try {
            Optional<Location> fromOpt = locationRepository.findById(fromLocationId);
            Optional<Location> toOpt = locationRepository.findById(toLocationId);
            
            if (!fromOpt.isPresent() || !toOpt.isPresent()) {
                return new RouteResponse(null, 0.0, null, false, "Invalid location IDs");
            }
            
            Location from = fromOpt.get();
            Location to = toOpt.get();
            
            // Build the graph
            Map<Long, List<GraphEdge>> graph = buildGraph();
            
            // Run Dijkstra's algorithm
            DijkstraResult result = dijkstra(graph, fromLocationId, toLocationId);
            
            if (result.path == null || result.path.isEmpty()) {
                return new RouteResponse(null, 0.0, null, false, "No path found");
            }
            
            // Convert location IDs to PathNodes
            List<PathNode> pathNodes = convertToPathNodes(result.path);
            
            // Generate turn-by-turn instructions
            List<NavigationInstruction> instructions = generateInstructions(pathNodes);
            
            return new RouteResponse(pathNodes, result.distance, instructions, true, "Route found successfully");
            
        } catch (Exception e) {
            return new RouteResponse(null, 0.0, null, false, "Error finding path: " + e.getMessage());
        }
    }
    
    /**
     * Build adjacency list representation of the graph
     */
    private Map<Long, List<GraphEdge>> buildGraph() {
        Map<Long, List<GraphEdge>> graph = new HashMap<>();
        
        // Add all edges (bidirectional)
        List<Edge> edges = edgeRepository.findAll();
        for (Edge edge : edges) {
            Long from = edge.getFromLocation().getId();
            Long to = edge.getToLocation().getId();
            double weight = edge.getWeight().doubleValue();
            
            graph.computeIfAbsent(from, k -> new ArrayList<>()).add(new GraphEdge(to, weight, false, null));
            graph.computeIfAbsent(to, k -> new ArrayList<>()).add(new GraphEdge(from, weight, false, null));
        }
        
        // Add vertical links (bidirectional)
        List<VerticalLink> verticalLinks = verticalLinkRepository.findAll();
        for (VerticalLink link : verticalLinks) {
            Long from = link.getFromLocation().getId();
            Long to = link.getToLocation().getId();
            double weight = link.getWeight().doubleValue();
            String type = link.getVerticalType();
            
            graph.computeIfAbsent(from, k -> new ArrayList<>()).add(new GraphEdge(to, weight, true, type));
            graph.computeIfAbsent(to, k -> new ArrayList<>()).add(new GraphEdge(from, weight, true, type));
        }
        
        return graph;
    }
    
    /**
     * Dijkstra's algorithm implementation
     */
    private DijkstraResult dijkstra(Map<Long, List<GraphEdge>> graph, Long start, Long end) {
        Map<Long, Double> distances = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();
        PriorityQueue<NodeDistance> pq = new PriorityQueue<>(Comparator.comparingDouble(nd -> nd.distance));
        Set<Long> visited = new HashSet<>();
        
        distances.put(start, 0.0);
        pq.offer(new NodeDistance(start, 0.0));
        
        while (!pq.isEmpty()) {
            NodeDistance current = pq.poll();
            Long currentNode = current.nodeId;
            
            if (visited.contains(currentNode)) {
                continue;
            }
            
            visited.add(currentNode);
            
            if (currentNode.equals(end)) {
                break;
            }
            
            List<GraphEdge> neighbors = graph.getOrDefault(currentNode, new ArrayList<>());
            for (GraphEdge edge : neighbors) {
                Long neighbor = edge.toNode;
                double newDist = distances.get(currentNode) + edge.weight;
                
                if (newDist < distances.getOrDefault(neighbor, Double.MAX_VALUE)) {
                    distances.put(neighbor, newDist);
                    previous.put(neighbor, currentNode);
                    pq.offer(new NodeDistance(neighbor, newDist));
                }
            }
        }
        
        // Reconstruct path
        List<Long> path = new ArrayList<>();
        Double totalDistance = distances.get(end);
        
        if (totalDistance == null || totalDistance == Double.MAX_VALUE) {
            return new DijkstraResult(null, 0.0);
        }
        
        Long current = end;
        while (current != null) {
            path.add(0, current);
            current = previous.get(current);
        }
        
        return new DijkstraResult(path, totalDistance);
    }
    
    /**
     * Convert location IDs to PathNode objects with full details
     */
    private List<PathNode> convertToPathNodes(List<Long> locationIds) {
        List<PathNode> pathNodes = new ArrayList<>();
        
        for (Long locationId : locationIds) {
            Optional<Location> locOpt = locationRepository.findById(locationId);
            if (locOpt.isPresent()) {
                Location loc = locOpt.get();
                Floor floor = loc.getFloor();
                Building building = floor.getBuilding();
                
                PathNode node = new PathNode(
                    loc.getId(),
                    loc.getName(),
                    floor.getId(),
                    floor.getFloorNumber(),
                    building.getName(),
                    loc.getX(),
                    loc.getY(),
                    loc.getType()
                );
                pathNodes.add(node);
            }
        }
        
        return pathNodes;
    }
    
    /**
     * Generate human-readable turn-by-turn navigation instructions
     */
    private List<NavigationInstruction> generateInstructions(List<PathNode> pathNodes) {
        List<NavigationInstruction> instructions = new ArrayList<>();
        
        if (pathNodes.isEmpty()) {
            return instructions;
        }
        
        // Start instruction
        PathNode start = pathNodes.get(0);
        instructions.add(new NavigationInstruction(
            "Start at " + start.getLocationName(),
            "start",
            0.0,
            start.getLocationType(),
            start.getLocationName()
        ));
        
        // Generate instructions for each step
        for (int i = 1; i < pathNodes.size(); i++) {
            PathNode current = pathNodes.get(i);
            PathNode previous = pathNodes.get(i - 1);
            
            // Calculate distance between nodes
            double distance = calculateDistance(previous, current);
            
            String instruction = "";
            String direction = "straight";
            
            // Check if changing floors
            if (!current.getFloorId().equals(previous.getFloorId())) {
                if (current.getLocationType().equals("stairs")) {
                    instruction = String.format("Take stairs to %s - Floor %d", 
                        current.getBuildingName(), current.getFloorNumber());
                    direction = "stairs";
                } else if (current.getLocationType().equals("elevator")) {
                    instruction = String.format("Take elevator to %s - Floor %d", 
                        current.getBuildingName(), current.getFloorNumber());
                    direction = "elevator";
                } else {
                    instruction = String.format("Go to Floor %d", current.getFloorNumber());
                    direction = "floor_change";
                }
            } else {
                // Same floor navigation
                String directionStr = calculateDirection(previous, current);
                instruction = String.format("Walk %s for %.1fm towards %s", 
                    directionStr, distance, current.getLocationName());
                direction = directionStr;
            }
            
            instructions.add(new NavigationInstruction(
                instruction,
                direction,
                distance,
                current.getLocationType(),
                current.getLocationName()
            ));
        }
        
        // Arrival instruction
        PathNode end = pathNodes.get(pathNodes.size() - 1);
        instructions.add(new NavigationInstruction(
            "You have arrived at " + end.getLocationName(),
            "arrive",
            0.0,
            end.getLocationType(),
            end.getLocationName()
        ));
        
        return instructions;
    }
    
    /**
     * Calculate Euclidean distance between two nodes
     */
    private double calculateDistance(PathNode from, PathNode to) {
        double dx = to.getX().doubleValue() - from.getX().doubleValue();
        double dy = to.getY().doubleValue() - from.getY().doubleValue();
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Determine direction of movement
     */
    private String calculateDirection(PathNode from, PathNode to) {
        double dx = to.getX().doubleValue() - from.getX().doubleValue();
        double dy = to.getY().doubleValue() - from.getY().doubleValue();
        
        double angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        if (angle >= -45 && angle < 45) return "right";
        else if (angle >= 45 && angle < 135) return "down";
        else if (angle >= 135 || angle < -135) return "left";
        else return "up";
    }
    
    // Helper classes
    private static class GraphEdge {
        Long toNode;
        double weight;
        boolean isVertical;
        String verticalType;
        
        GraphEdge(Long toNode, double weight, boolean isVertical, String verticalType) {
            this.toNode = toNode;
            this.weight = weight;
            this.isVertical = isVertical;
            this.verticalType = verticalType;
        }
    }
    
    private static class NodeDistance {
        Long nodeId;
        double distance;
        
        NodeDistance(Long nodeId, double distance) {
            this.nodeId = nodeId;
            this.distance = distance;
        }
    }
    
    private static class DijkstraResult {
        List<Long> path;
        Double distance;
        
        DijkstraResult(List<Long> path, Double distance) {
            this.path = path;
            this.distance = distance;
        }
    }
}
