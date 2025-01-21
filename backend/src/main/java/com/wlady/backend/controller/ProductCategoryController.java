package com.wlady.backend.controller;

import com.wlady.backend.dao.ProductCategoryRepository;
import com.wlady.backend.dto.ProductCategoryDTO;
import com.wlady.backend.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/product-category")
@CrossOrigin("http://localhost:4200")
public class ProductCategoryController {
    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @GetMapping
    public List<ProductCategoryDTO> getProductCategories() {
        return productCategoryRepository.findAll().stream()
                .map(productCategory -> ProductCategoryDTO.builder()
                        .id(productCategory.getId())
                        .categoryName(productCategory.getCategoryName())
                        .build()
                ).toList();
    }
}
