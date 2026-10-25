package org.ruh.ims.service;

import org.ruh.ims.model.ProductReturn;
import org.ruh.ims.repository.ProductReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class ReturnService {
    @Autowired
    private ProductReturnRepository returnRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private SaleService saleService;

    public List<ProductReturn> getAllReturns() {
        return returnRepository.findAll();
    }

    public ProductReturn createReturn(ProductReturn productReturn) {
        // Verify the invoice exists
        saleService.getSaleByInvoiceNumber(productReturn.getInvoiceNumber());

        productReturn.setReturnDate(LocalDateTime.now());

        // Get product name
        var product = productService.getProductById(productReturn.getProductId());
        productReturn.setProductName(product.getProductName());

        // Increase product quantity (return to stock)
        productService.updateQuantity(productReturn.getProductId(), productReturn.getQuantity());

        return returnRepository.save(productReturn);
    }
}
