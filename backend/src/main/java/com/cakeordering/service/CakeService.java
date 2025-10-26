package com.cakeordering.service;

import com.cakeordering.model.Cake;
import com.cakeordering.repository.CakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CakeService {

    @Autowired
    private CakeRepository cakeRepository;

    public List<Cake> getAllCakes() {
        return cakeRepository.findAll();
    }

    public Cake getCakeById(Long id) {
        return cakeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cake not found"));
    }

    public List<Cake> getCakesByFlavor(String flavor) {
        return cakeRepository.findByFlavor(flavor);
    }

    public List<Cake> getCakesByOccasion(String occasion) {
        return cakeRepository.findByOccasion(occasion);
    }

    public List<Cake> getCakesByPriceRange(Double minPrice, Double maxPrice) {
        return cakeRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Cake> searchCakes(String keyword) {
        return cakeRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Cake createCake(Cake cake) {
        return cakeRepository.save(cake);
    }

    public Cake updateCake(Long id, Cake cakeDetails) {
        Cake cake = getCakeById(id);
        cake.setName(cakeDetails.getName());
        cake.setFlavor(cakeDetails.getFlavor());
        cake.setPrice(cakeDetails.getPrice());
        cake.setDescription(cakeDetails.getDescription());
        cake.setImageUrl(cakeDetails.getImageUrl());
        cake.setSize(cakeDetails.getSize());
        cake.setOccasion(cakeDetails.getOccasion());
        cake.setIngredients(cakeDetails.getIngredients());
        cake.setInStock(cakeDetails.getInStock());
        return cakeRepository.save(cake);
    }

    public void deleteCake(Long id) {
        Cake cake = getCakeById(id);
        cakeRepository.delete(cake);
    }
}
