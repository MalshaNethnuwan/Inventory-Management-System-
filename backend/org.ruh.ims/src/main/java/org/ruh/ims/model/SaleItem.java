package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {
    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;
    private double total;
}
