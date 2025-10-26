package com.cakeordering.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cakes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String flavor;

    @Column(nullable = false)
    private Double price;

    @Column(length = 1000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private String size = "Medium"; // Small, Medium, Large

    private String occasion; // Birthday, Wedding, Anniversary, etc.

    private String ingredients;

    private Double rating = 0.0;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @OneToMany(mappedBy = "cake", cascade = CascadeType.ALL)
    private Set<OrderItem> orderItems = new HashSet<>();

    @OneToMany(mappedBy = "cake", cascade = CascadeType.ALL)
    private Set<Review> reviews = new HashSet<>();
}
