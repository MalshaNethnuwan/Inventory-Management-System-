package org.ruh.ims.repository;


import org.ruh.ims.model.ProductReturn;
import org.ruh.ims.model.PurchaseOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PurchaseOrderRepository extends MongoRepository<PurchaseOrder, String> {
    List<PurchaseOrder> findByStatus(String status);
    long countByStatus(String status);
}
