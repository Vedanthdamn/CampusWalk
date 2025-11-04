package com.campuswalk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private List<PathNode> path;
    private Double totalDistance;
    private List<NavigationInstruction> instructions;
    private boolean success;
    private String message;
}
