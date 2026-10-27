package org.ruh.ims.controller;

import org.ruh.ims.dto.StockAdjustmentRequest;
import org.ruh.ims.dto.StockTransferRequest;
import org.ruh.ims.model.Product;
import org.ruh.ims.model.StockAdjustment;
import org.ruh.ims.model.StockTransfer;
import org.ruh.ims.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/stock")
public class StockController {
    @Autowired
    private StockService stockService;

    @GetMapping
    public List<Product> getAllStock() {
        return stockService.getAllStock();
    }

    @GetMapping("/adjustments")
    public List<StockAdjustment> getAdjustments() {
        return stockService.getRecentAdjustments();
    }

    @GetMapping("/adjustments/pending")
    public List<StockAdjustment> getPendingAdjustments() {
        return stockService.getPendingAdjustments();
    }

    @PostMapping("/adjust")
    public ResponseEntity<StockAdjustment> adjust(@RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.status(201).body(stockService.createAdjustment(request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<StockTransfer> transfer(@RequestBody StockTransferRequest request) {
        return ResponseEntity.status(201).body(stockService.createTransfer(request));
    }

    @PostMapping("/approve/{adjustmentId}")
    public StockAdjustment approve(@PathVariable String adjustmentId) {
        return stockService.approveAdjustment(adjustmentId);
    }

    @PostMapping("/approve")
    public StockAdjustment approveWithBody(@RequestBody java.util.Map<String, String> body) {
        String id = body.get("adjustmentId");
        if (id == null) {
            id = body.get("id");
        }
        return stockService.approveAdjustment(id);
    }
}
