package com.wlady.backend.controller;

import com.wlady.backend.dao.CountryRepository;
import com.wlady.backend.dto.CountryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@CrossOrigin("http://localhost:4200")
public class CountryController {
    @Autowired
    private CountryRepository countryRepository;

    @GetMapping
    public List<CountryDTO> getCountries() {
        return countryRepository.findAll().stream()
                .map(country -> CountryDTO.builder()
                        .id(country.getId())
                        .name(country.getName())
                        .code(country.getCode())
                        .build()
                ).toList();
    }
}
