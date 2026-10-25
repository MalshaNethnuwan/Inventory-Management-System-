package org.ruh.ims.service;

import org.ruh.ims.dto.StockAdjustmentRequest;
import org.ruh.ims.dto.StockTransferRequest;
import org.ruh.ims.model.Product;
import org.ruh.ims.model.StockAdjustment;
import org.ruh.ims.model.StockTransfer;
import org.ruh.ims.repository.StockAdjustmentRepository;
import org.ruh.ims.repository.StockTransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockService {
    @Autowired
    private ProductService productService;

    @Autowired
    private StockAdjustmentRepository adjustmentRepository;

    @Autowired
    private StockTransferRepository transferRepository;

    public List<Product> getAllStock() {
        return productService.getAllProducts();
    }

    public StockAdjustment createAdjustment(StockAdjustmentRequest request) {
        Product product = productService.getProductById(request.getProductId());

        StockAdjustment adjustment = new StockAdjustment();
        adjustment.setProductId(request.getProductId());
        adjustment.setProductName(product.getProductName());
        adjustment.setCurrentQuantity(product.getQuantity());
        adjustment.setAdjustmentQuantity(request.getAdjustmentQuantity());
        adjustment.setReason(request.getReason());
        adjustment.setAdjustmentDate(LocalDateTime.now());
        adjustment.setStatus("PENDING");

        return adjustmentRepository.save(adjustment);
    }

    public StockAdjustment approveAdjustment(String adjustmentId) {
        StockAdjustment adjustment = adjustmentRepository.findById(adjustmentId)
                .orElseThrow(() -> new RuntimeException("Adjustment not found"));

        if ("APPROVED".equals(adjustment.getStatus())) {
            throw new RuntimeException("Already approved");
        }

        // Apply the quantity change
        productService.updateQuantity(adjustment.getProductId(), adjustment.getAdjustmentQuantity());
        adjustment.setStatus("APPROVED");
        return adjustmentRepository.save(adjustment);
    }

    public List<StockAdjustment> getRecentAdjustments() {
        return adjustmentRepository.findTop10ByOrderByAdjustmentDateDesc();
    }

    public List<StockAdjustment> getPendingAdjustments() {
        return adjustmentRepository.findByStatus("PENDING");
    }

    public StockTransfer createTransfer(StockTransferRequest request) {
        Product product = productService.getProductById(request.getProductId());

        StockTransfer transfer = new StockTransfer();
        transfer.setProductId(request.getProductId());
        transfer.setProductName(product.getProductName());
        transfer.setQuantity(request.getQuantity());
        transfer.setFromLocation(request.getFromLocation());
        transfer.setToLocation(request.getToLocation());
        transfer.setTransferDate(LocalDateTime.now());
        transfer.setStatus("COMPLETED");

        return transferRepository.save(transfer);
    }
}
