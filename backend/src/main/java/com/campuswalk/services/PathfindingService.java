package com.campuswalk.services;

import com.campuswalk.dto.RouteNode;
import com.campuswalk.models.GraphEdge;
import com.campuswalk.models.GraphNode;
import com.campuswalk.repositories.GraphEdgeRepository;
import com.campuswalk.repositories.GraphNodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PathfindingService {
    
    @Autowired
    private GraphNodeRepository graphNodeRepository;
    
    @Autowired
    private GraphEdgeRepository graphEdgeRepository;
    
    /**
     * Find the shortest outdoor path between two nodes using Dijkstra's algorithm
     */
    public List<RouteNode> findShortestPath(Long fromNodeId, Long toNodeId) {
        try {
            Optional<GraphNode> fromOpt = graphNodeRepository.findById(fromNodeId);
            Optional<GraphNode> toOpt = graphNodeRepository.findById(toNodeId);
            
            if (!fromOpt.isPresent() || !toOpt.isPresent()) {
                return new ArrayList<>();
            }
            
            // Build the graph
            Map<Long, List<Edge>> graph = buildGraph();
            
            // Run Dijkstra's algorithm
            DijkstraResult result = dijkstra(graph, fromNodeId, toNodeId);
            
            if (result.path == null || result.path.isEmpty()) {
                return new ArrayList<>();
            }
            
            // Convert node IDs to RouteNode objects with coordinates and instructions
            return convertToRouteNodes(result.path);
            
        } catch (Exception e) {
            System.err.println("Error finding path: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    /**
     * Build adjacency list representation of the graph
     */
    private Map<Long, List<Edge>> buildGraph() {
        Map<Long, List<Edge>> graph = new HashMap<>();
        
        // Add all edges
        List<GraphEdge> edges = graphEdgeRepository.findAll();
        for (GraphEdge edge : edges) {
            Long from = edge.getFromNode();
            Long to = edge.getToNode();
            double weight = edge.getWeight().doubleValue();
            
            graph.computeIfAbsent(from, k -> new ArrayList<>()).add(new Edge(to, weight));
        }
        
        return graph;
    }
    
    /**
     * Dijkstra's algorithm implementation
     */
    private DijkstraResult dijkstra(Map<Long, List<Edge>> graph, Long start, Long end) {
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
            
            List<Edge> neighbors = graph.getOrDefault(currentNode, new ArrayList<>());
            for (Edge edge : neighbors) {
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
     * Convert node IDs to RouteNode objects with coordinates and instructions
     */
    private List<RouteNode> convertToRouteNodes(List<Long> nodeIds) {
        List<RouteNode> routeNodes = new ArrayList<>();
        
        for (int i = 0; i < nodeIds.size(); i++) {
            Long nodeId = nodeIds.get(i);
            Optional<GraphNode> nodeOpt = graphNodeRepository.findById(nodeId);
            
            if (nodeOpt.isPresent()) {
                GraphNode node = nodeOpt.get();
                String instruction;
                
                if (i == 0) {
                    instruction = "Start at " + node.getName();
                } else if (i == nodeIds.size() - 1) {
                    instruction = "Arrive at " + node.getName();
                } else {
                    instruction = "Continue through " + node.getName();
                }
                
                RouteNode routeNode = new RouteNode(
                    node.getLat(),
                    node.getLng(),
                    instruction
                );
                routeNodes.add(routeNode);
            }
        }
        
        return routeNodes;
    }
    
    // Helper classes
    private static class Edge {
        Long toNode;
        double weight;
        
        Edge(Long toNode, double weight) {
            this.toNode = toNode;
            this.weight = weight;
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
