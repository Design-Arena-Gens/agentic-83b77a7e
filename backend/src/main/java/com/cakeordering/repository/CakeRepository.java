package com.cakeordering.repository;

import com.cakeordering.model.Cake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CakeRepository extends JpaRepository<Cake, Long> {
    List<Cake> findByFlavor(String flavor);
    List<Cake> findByOccasion(String occasion);
    List<Cake> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Cake> findByInStock(Boolean inStock);
    List<Cake> findByNameContainingIgnoreCase(String name);
}
