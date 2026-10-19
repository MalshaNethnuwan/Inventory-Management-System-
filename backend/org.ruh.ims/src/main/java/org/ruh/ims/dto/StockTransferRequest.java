package org.ruh.ims.dto;

import lombok.Data;

@Data
public class StockTransferRequest {
    private String productId;
    private int quantity;
    private String fromLocation;
    private String toLocation;
}
