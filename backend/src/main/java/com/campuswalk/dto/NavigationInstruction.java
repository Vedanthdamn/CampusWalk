package com.campuswalk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NavigationInstruction {
    private String instruction;
    private String direction;
    private Double distance;
    private String locationType;
    private String locationName;
}
