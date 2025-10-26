package com.cakeordering.service;

import com.cakeordering.dto.ReviewRequest;
import com.cakeordering.model.Cake;
import com.cakeordering.model.Review;
import com.cakeordering.model.User;
import com.cakeordering.repository.CakeRepository;
import com.cakeordering.repository.ReviewRepository;
import com.cakeordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CakeRepository cakeRepository;

    @Transactional
    public Review createReview(ReviewRequest reviewRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cake cake = cakeRepository.findById(reviewRequest.getCakeId())
                .orElseThrow(() -> new RuntimeException("Cake not found"));

        Review review = new Review();
        review.setUser(user);
        review.setCake(cake);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        Review savedReview = reviewRepository.save(review);

        // Update cake rating
        updateCakeRating(cake.getId());

        return savedReview;
    }

    private void updateCakeRating(Long cakeId) {
        Cake cake = cakeRepository.findById(cakeId)
                .orElseThrow(() -> new RuntimeException("Cake not found"));

        List<Review> reviews = reviewRepository.findByCakeId(cakeId);
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            cake.setRating(averageRating);
            cake.setReviewCount(reviews.size());
            cakeRepository.save(cake);
        }
    }

    public List<Review> getReviewsByCakeId(Long cakeId) {
        return reviewRepository.findByCakeId(cakeId);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
}
