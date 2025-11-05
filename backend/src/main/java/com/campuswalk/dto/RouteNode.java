package com.campuswalk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteNode {
    private BigDecimal lat;
    private BigDecimal lng;
    private String instruction;
}
