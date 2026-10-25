package org.ruh.ims.repository;

import org.ruh.ims.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryId(String categoryId);
    List<Product> findByStatus(String status);
    List<Product> findByProductNameContainingIgnoreCase(String name);
    long countByStatus(String status);
}
