package org.ruh.ims.controller;

import org.ruh.ims.model.Product;
import org.ruh.ims.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String search,
                                @RequestParam(required = false) String categoryId) {
        if (search != null && !search.isEmpty()) {
            return productService.searchProducts(search);
        }
        if (categoryId != null && !categoryId.isEmpty()) {
            return productService.getProductsByCategory(categoryId);
        }
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return ResponseEntity.status(201).body(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable String id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
