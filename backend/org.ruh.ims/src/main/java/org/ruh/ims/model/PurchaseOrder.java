package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "purchase_orders")
public class PurchaseOrder {

    @Id
    private String id;
    private String orderNumber;
    private String supplierId;
    private LocalDateTime orderDate;
    private List<PurchaseOrderItem> items;
    private double totalAmount;
    private String status;
}
