package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sales")
public class Sale {

    @Id
    private String id;
    private String invoiceNumber;
    private LocalDateTime saleDate;
    private String customerName;
    private List<SaleItem> items;
    private double totalAmount;
    private String createdBy;
}
