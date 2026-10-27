package org.ruh.ims.controller;

import org.ruh.ims.model.PurchaseOrder;
import org.ruh.ims.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {
    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public List<PurchaseOrder> getAll() {
        return purchaseOrderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public PurchaseOrder getById(@PathVariable String id) {
        return purchaseOrderService.getOrderById(id);
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> create(@RequestBody PurchaseOrder order) {
        return ResponseEntity.status(201).body(purchaseOrderService.createOrder(order));
    }

    @PutMapping("/{id}")
    public PurchaseOrder updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return purchaseOrderService.updateOrderStatus(id, body.get("status"));
    }

    @PostMapping("/{id}/approve")
    public PurchaseOrder approve(@PathVariable String id) {
        return purchaseOrderService.approveOrder(id);
    }
}
