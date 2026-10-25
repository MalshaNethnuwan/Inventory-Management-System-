package org.ruh.ims.service;

import org.ruh.ims.model.Sale;
import org.ruh.ims.model.SaleItem;
import org.ruh.ims.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {
    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductService productService;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale getSaleById(String id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    public Sale getSaleByInvoiceNumber(String invoiceNumber) {
        return saleRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    public List<Sale> getRecentSales() {
        return saleRepository.findTop10ByOrderBySaleDateDesc();
    }

    public Sale createSale(Sale sale) {
        // Generate invoice number
        long count = saleRepository.count();
        sale.setInvoiceNumber("INV-" + String.format("%03d", count + 1));
        sale.setSaleDate(LocalDateTime.now());

        // Calculate totals and reduce stock
        double total = 0;
        for (SaleItem item : sale.getItems()) {
            item.setTotal(item.getQuantity() * item.getUnitPrice());
            total += item.getTotal();

            // Reduce product quantity
            productService.updateQuantity(item.getProductId(), -item.getQuantity());
        }
        sale.setTotalAmount(total);

        return saleRepository.save(sale);
    }

    public List<Sale> getSalesByDateRange(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findBySaleDateBetween(start, end);
    }
}
