package org.ruh.ims.repository;

import org.ruh.ims.model.StockAdjustment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StockAdjustmentRepository extends MongoRepository<StockAdjustment, String> {
    List<StockAdjustment> findTop10ByOrderByAdjustmentDateDesc();
    List<StockAdjustment> findByStatus(String status);
}
