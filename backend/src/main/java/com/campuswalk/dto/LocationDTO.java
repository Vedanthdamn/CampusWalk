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
