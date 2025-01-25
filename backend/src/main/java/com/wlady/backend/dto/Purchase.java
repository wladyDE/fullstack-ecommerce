package com.wlady.backend.dto;

import com.wlady.backend.entity.Address;
import com.wlady.backend.entity.Customer;
import com.wlady.backend.entity.Order;
import com.wlady.backend.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
