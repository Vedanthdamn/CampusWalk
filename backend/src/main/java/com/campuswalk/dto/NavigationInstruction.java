package com.campuswalk.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NavigationInstruction {
    private String instruction;
    private String direction;
    private Double distance;
    private String locationType;
    private String locationName;
}
