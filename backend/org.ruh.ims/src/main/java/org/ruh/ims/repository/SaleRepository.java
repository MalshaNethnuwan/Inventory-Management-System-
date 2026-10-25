package org.ruh.ims.repository;

import org.ruh.ims.model.Sale;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends MongoRepository<Sale,String> {
    Optional<Sale> findByInvoiceNumber(String invoiceNumber);
    List<Sale> findBySaleDateBetween(LocalDateTime start, LocalDateTime end);
    List<Sale> findTop10ByOrderBySaleDateDesc();
}
