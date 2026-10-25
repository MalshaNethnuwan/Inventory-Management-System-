package org.ruh.ims.service;

import org.ruh.ims.model.Product;
import org.ruh.ims.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product createProduct(Product product) {
        product.setStatus(calculateStatus(product));
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updated) {
        Product product = getProductById(id);
        product.setProductCode(updated.getProductCode());
        product.setProductName(updated.getProductName());
        product.setDescription(updated.getDescription());
        product.setPrice(updated.getPrice());
        product.setQuantity(updated.getQuantity());
        product.setMinimumStock(updated.getMinimumStock());
        product.setCategoryId(updated.getCategoryId());
        product.setSupplierId(updated.getSupplierId());
        product.setStatus(calculateStatus(updated));
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public String calculateStatus(Product product) {
        if (product.getQuantity() == 0) {
            return "OUT_OF_STOCK";
        } else if (product.getQuantity() <= product.getMinimumStock()) {
            return "LOW_STOCK";
        } else {
            return "AVAILABLE";
        }
    }

    public void updateQuantity(String id, int change) {
        Product product = getProductById(id);
        product.setQuantity(product.getQuantity() + change);
        product.setStatus(calculateStatus(product));
        productRepository.save(product);
    }
}
