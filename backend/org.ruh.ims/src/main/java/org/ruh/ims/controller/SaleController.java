package org.ruh.ims.controller;

import org.ruh.ims.model.Sale;
import org.ruh.ims.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/sales")
public class SaleController {
    @Autowired
    private SaleService saleService;

    @GetMapping
    public List<Sale> getAll() {
        return saleService.getAllSales();
    }

    @GetMapping("/{id}")
    public Sale getById(@PathVariable String id) {
        return saleService.getSaleById(id);
    }

    @GetMapping("/invoice/{invoiceNumber}")
    public Sale getByInvoice(@PathVariable String invoiceNumber) {
        return saleService.getSaleByInvoiceNumber(invoiceNumber);
    }

    @PostMapping
    public ResponseEntity<Sale> create(@RequestBody Sale sale) {
        return ResponseEntity.status(201).body(saleService.createSale(sale));
    }
}
