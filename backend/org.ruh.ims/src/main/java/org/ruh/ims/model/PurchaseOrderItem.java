package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderItem {

    @Id
    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;
    private double total;
}
