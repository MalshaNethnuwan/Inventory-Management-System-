package org.ruh.ims.controller;

import org.ruh.ims.model.Product;
import org.ruh.ims.model.PurchaseOrder;
import org.ruh.ims.model.Sale;
import org.ruh.ims.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/sales")
    public List<Sale> salesReport() {
        return reportService.getSalesReport();
    }

    @GetMapping("/stock")
    public List<Product> stockReport() {
        return reportService.getStockReport();
    }

    @GetMapping("/purchases")
    public List<PurchaseOrder> purchaseReport() {
        return reportService.getPurchaseReport();
    }

    @GetMapping("/low-stock")
    public List<Product> lowStockReport() {
        return reportService.getLowStockReport();
    }
}
