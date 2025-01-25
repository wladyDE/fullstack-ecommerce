package com.wlady.backend.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.wlady.backend.dto.PaymentInfo;
import com.wlady.backend.dto.Purchase;
import com.wlady.backend.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
