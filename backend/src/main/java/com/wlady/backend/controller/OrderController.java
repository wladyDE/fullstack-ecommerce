package com.wlady.backend.controller;


import com.wlady.backend.dto.OrderDTO;
import com.wlady.backend.entity.Order;
import com.wlady.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/search/findByCustomerEmail")
    public Page<OrderDTO> getOrders(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByCustomerEmailOrderByDateCreatedDesc(email, pageable);

        return orderPage.map(order -> OrderDTO.builder()
                .id(order.getId().toString())
                .orderTrackingNumber(order.getOrderTrackingNumber())
                .totalPrice(order.getTotalPrice())
                .totalQuantity(order.getTotalQuantity())
                .dateCreated(order.getDateCreated())
                .build());
    }
}