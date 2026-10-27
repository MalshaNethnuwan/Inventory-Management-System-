package org.ruh.ims.service;

import org.ruh.ims.model.Product;
import org.ruh.ims.model.ProductReturn;
import org.ruh.ims.model.PurchaseOrder;
import org.ruh.ims.model.Sale;
import org.ruh.ims.repository.ProductRepository;
import org.ruh.ims.repository.PurchaseOrderRepository;
import org.ruh.ims.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ReportService {
    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    public List<Sale> getSalesReport() {
        return saleRepository.findAll();
    }

    public List<Product> getStockReport() {
        return productRepository.findAll();
    }

    public List<PurchaseOrder> getPurchaseReport() {
        return purchaseOrderRepository.findAll();
    }

    public List<Product> getLowStockReport() {
        List<Product> lowStock = productRepository.findByStatus("LOW_STOCK");
        List<Product> outOfStock = productRepository.findByStatus("OUT_OF_STOCK");
        lowStock.addAll(outOfStock);
        return lowStock;
    }
}
