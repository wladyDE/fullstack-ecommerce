package com.wlady.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class CountryDTO {
    private int id;
    private String name;
    private String code;
}
