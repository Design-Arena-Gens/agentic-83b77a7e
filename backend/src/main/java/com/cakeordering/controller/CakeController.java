package com.cakeordering.controller;

import com.cakeordering.model.Cake;
import com.cakeordering.service.CakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
@CrossOrigin(origins = {"http://localhost:3000", "https://agentic-83b77a7e.vercel.app"})
public class CakeController {

    @Autowired
    private CakeService cakeService;

    @GetMapping
    public ResponseEntity<List<Cake>> getAllCakes() {
        return ResponseEntity.ok(cakeService.getAllCakes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cake> getCakeById(@PathVariable Long id) {
        return ResponseEntity.ok(cakeService.getCakeById(id));
    }

    @GetMapping("/flavor/{flavor}")
    public ResponseEntity<List<Cake>> getCakesByFlavor(@PathVariable String flavor) {
        return ResponseEntity.ok(cakeService.getCakesByFlavor(flavor));
    }

    @GetMapping("/occasion/{occasion}")
    public ResponseEntity<List<Cake>> getCakesByOccasion(@PathVariable String occasion) {
        return ResponseEntity.ok(cakeService.getCakesByOccasion(occasion));
    }

    @GetMapping("/price")
    public ResponseEntity<List<Cake>> getCakesByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        return ResponseEntity.ok(cakeService.getCakesByPriceRange(minPrice, maxPrice));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Cake>> searchCakes(@RequestParam String keyword) {
        return ResponseEntity.ok(cakeService.searchCakes(keyword));
    }
}
