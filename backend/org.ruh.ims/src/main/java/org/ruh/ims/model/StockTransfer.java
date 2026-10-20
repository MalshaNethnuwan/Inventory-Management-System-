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
@Document(collection = "stock_transfers")
public class StockTransfer {

    @Id
    private String id;
    private String productId;
    private String productName;
    private int quantity;
    private String fromLocation;
    private String toLocation;
    private LocalDateTime transferDate;
    private String status;
}
