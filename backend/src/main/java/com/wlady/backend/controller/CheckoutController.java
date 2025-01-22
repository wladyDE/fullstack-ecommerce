package com.wlady.backend.controller;

import com.wlady.backend.dto.Purchase;
import com.wlady.backend.dto.PurchaseResponse;
import com.wlady.backend.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    @Autowired
    private CheckoutService checkoutService;

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        return checkoutService.placeOder(purchase);
    }
}
