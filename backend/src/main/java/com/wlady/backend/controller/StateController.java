package com.wlady.backend.controller;

import com.wlady.backend.repository.StateRepository;
import com.wlady.backend.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
public class StateController {
    @Autowired
    StateRepository stateRepository;

    @GetMapping()
    public List<State> getState(@RequestParam(value = "code") String code) {
        return stateRepository.findByCountryCode(code);
    }
}
