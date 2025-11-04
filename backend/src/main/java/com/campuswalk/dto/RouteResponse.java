package com.campuswalk.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private List<PathNode> path;
    private Double totalDistance;
    private List<NavigationInstruction> instructions;
    private boolean success;
    private String message;
}
