package com.campuswalk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private Long id;
    private String name;
    private String type;
    private BigDecimal x;
    private BigDecimal y;
    private String description;
    private Long floorId;
    private Integer floorNumber;
    private String floorName;
    private Long buildingId;
    private String buildingName;
}
