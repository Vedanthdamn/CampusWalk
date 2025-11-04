package com.campuswalk.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PathNode {
    private Long locationId;
    private String locationName;
    private Long floorId;
    private Integer floorNumber;
    private String buildingName;
    private BigDecimal x;
    private BigDecimal y;
    private String locationType;
}
