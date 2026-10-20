package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    private String id;
    private String productCode;
    private String productName;
    private String description;
    private double price;
    private int quantity;
    private int minimumStock;
    private String categoryId;
    private String supplierId;
    private String status;
}
