package org.ruh.ims.repository;

import org.ruh.ims.model.StockTransfer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StockTransferRepository extends MongoRepository<StockTransfer, String> {

}
