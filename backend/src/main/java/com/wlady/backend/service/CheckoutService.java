package com.wlady.backend.service;

import com.wlady.backend.dto.Purchase;
import com.wlady.backend.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOder(Purchase purchase);
}
