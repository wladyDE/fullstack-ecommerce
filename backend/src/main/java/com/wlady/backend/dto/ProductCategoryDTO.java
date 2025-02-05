package com.wlady.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ProductCategoryDTO {
    private Long id;
    private String categoryName;
}
