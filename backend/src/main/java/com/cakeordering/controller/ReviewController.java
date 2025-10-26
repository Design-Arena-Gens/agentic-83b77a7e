package com.cakeordering.controller;

import com.cakeordering.dto.ReviewRequest;
import com.cakeordering.model.Review;
import com.cakeordering.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "https://agentic-83b77a7e.vercel.app"})
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok(reviewService.createReview(reviewRequest));
    }

    @GetMapping("/cake/{cakeId}")
    public ResponseEntity<List<Review>> getReviewsByCakeId(@PathVariable Long cakeId) {
        return ResponseEntity.ok(reviewService.getReviewsByCakeId(cakeId));
    }
}
