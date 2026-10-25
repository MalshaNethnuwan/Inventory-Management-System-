package org.ruh.ims.repository;

import org.ruh.ims.model.ProductReturn;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductReturnRepository extends MongoRepository<ProductReturn, String> {
    List<ProductReturn> findByInvoiceNumber(String invoiceNumber);
}
