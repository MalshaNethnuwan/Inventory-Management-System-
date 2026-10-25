package org.ruh.ims.service;

import org.ruh.ims.model.PurchaseOrder;
import org.ruh.ims.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class PurchaseOrderService {
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getOrderById(String id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    public PurchaseOrder createOrder(PurchaseOrder order) {
        long count = purchaseOrderRepository.count();
        order.setOrderNumber("PO-" + String.format("%03d", count + 1));
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        double total = order.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
        order.setTotalAmount(total);
        order.getItems().forEach(item -> item.setTotal(item.getQuantity() * item.getUnitPrice()));

        return purchaseOrderRepository.save(order);
    }

    public PurchaseOrder updateOrderStatus(String id, String status) {
        PurchaseOrder order = getOrderById(id);
        order.setStatus(status);
        return purchaseOrderRepository.save(order);
    }

    public PurchaseOrder approveOrder(String id) {
        return updateOrderStatus(id, "APPROVED");
    }
}
