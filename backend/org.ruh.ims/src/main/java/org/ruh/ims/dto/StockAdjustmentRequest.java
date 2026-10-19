package org.ruh.ims.dto;

import lombok.Data;

@Data
public class StockAdjustmentRequest {
    private String productId;
    private int adjustmentQuantity;
    private String reason;
}
