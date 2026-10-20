package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "stock_adjustments")
public class StockAdjustment {

    @Id
    private String id;
    private String productId;
    private String productName;
    private int currentQuantity;
    private int adjustmentQuantity;
    private String reason;
    private LocalDateTime adjustmentDate;
    private String status;
}
