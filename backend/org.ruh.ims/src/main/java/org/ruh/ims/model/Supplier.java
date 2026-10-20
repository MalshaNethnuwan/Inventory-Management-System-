package org.ruh.ims.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "suppliers")
public class Supplier {

    @Id
    private String id;
    private String supplierName;
    private String contactNumber;
    private String email;
    private String address;
}
