package com.cakeordering.service;

import com.cakeordering.dto.OrderItemRequest;
import com.cakeordering.dto.OrderRequest;
import com.cakeordering.model.Cake;
import com.cakeordering.model.Order;
import com.cakeordering.model.OrderItem;
import com.cakeordering.model.User;
import com.cakeordering.repository.CakeRepository;
import com.cakeordering.repository.OrderRepository;
import com.cakeordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CakeRepository cakeRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setPhoneNumber(orderRequest.getPhoneNumber());
        order.setSpecialInstructions(orderRequest.getSpecialInstructions());
        order.setStatus("PENDING");

        Set<OrderItem> orderItems = new HashSet<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Cake cake = cakeRepository.findById(itemRequest.getCakeId())
                    .orElseThrow(() -> new RuntimeException("Cake not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setCake(cake);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(cake.getPrice());
            orderItem.setCustomMessage(itemRequest.getCustomMessage());
            orderItem.setCustomDesignUrl(itemRequest.getCustomDesignUrl());

            orderItems.add(orderItem);
            totalAmount += cake.getPrice() * itemRequest.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Double getTotalRevenue() {
        Double revenue = orderRepository.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public Long getTotalOrderCount() {
        return orderRepository.getTotalOrderCount();
    }
}
