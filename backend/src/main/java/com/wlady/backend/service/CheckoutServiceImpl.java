package com.wlady.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.wlady.backend.dto.PaymentInfo;
import com.wlady.backend.repository.CustomerRepository;
import com.wlady.backend.dto.Purchase;
import com.wlady.backend.dto.PurchaseResponse;
import com.wlady.backend.entity.Customer;
import com.wlady.backend.entity.Order;
import com.wlady.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private  CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOder(Purchase purchase) {
        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);

        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        Customer customer = purchase.getCustomer();

        Customer customerFromDB = customerRepository.findByEmail(customer.getEmail());
        if(customerFromDB != null){
            customer = customerFromDB;
        }

        customer.add(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Luv2Shop purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail()); 

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
