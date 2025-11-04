package com.campuswalk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
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
