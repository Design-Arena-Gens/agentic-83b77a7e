package com.cakeordering.controller;

import com.cakeordering.dto.MessageResponse;
import com.cakeordering.model.Cake;
import com.cakeordering.model.Order;
import com.cakeordering.service.CakeService;
import com.cakeordering.service.FileStorageService;
import com.cakeordering.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "https://agentic-83b77a7e.vercel.app"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CakeService cakeService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private FileStorageService fileStorageService;

    // Cake Management
    @PostMapping("/cakes")
    public ResponseEntity<Cake> createCake(@RequestBody Cake cake) {
        return ResponseEntity.ok(cakeService.createCake(cake));
    }

    @PutMapping("/cakes/{id}")
    public ResponseEntity<Cake> updateCake(@PathVariable Long id, @RequestBody Cake cake) {
        return ResponseEntity.ok(cakeService.updateCake(id, cake));
    }

    @DeleteMapping("/cakes/{id}")
    public ResponseEntity<?> deleteCake(@PathVariable Long id) {
        cakeService.deleteCake(id);
        return ResponseEntity.ok(new MessageResponse("Cake deleted successfully"));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Dashboard Stats
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", orderService.getTotalRevenue());
        stats.put("totalOrders", orderService.getTotalOrderCount());
        return ResponseEntity.ok(stats);
    }
}
