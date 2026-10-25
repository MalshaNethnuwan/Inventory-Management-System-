package org.ruh.ims.service;

import org.ruh.ims.model.Sale;
import org.ruh.ims.model.StockAdjustment;
import org.ruh.ims.repository.ProductRepository;
import org.ruh.ims.repository.PurchaseOrderRepository;
import org.ruh.ims.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class DashboardService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SaleService saleService;

    @Autowired
    private StockService stockService;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalProducts", productRepository.count());
        stats.put("lowStockProducts", productRepository.countByStatus("LOW_STOCK") + productRepository.countByStatus("OUT_OF_STOCK"));
        stats.put("totalSuppliers", supplierRepository.count());
        stats.put("pendingPurchaseOrders", purchaseOrderRepository.countByStatus("PENDING"));

        // Today's sales
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<Sale> todaySales = saleService.getSalesByDateRange(startOfDay, endOfDay);
        double todayTotal = todaySales.stream().mapToDouble(Sale::getTotalAmount).sum();
        stats.put("todaySalesCount", todaySales.size());
        stats.put("todaySalesAmount", todayTotal);

        // Recent data
        List<Sale> recentSales = saleService.getRecentSales();
        List<StockAdjustment> recentStock = stockService.getRecentAdjustments();
        stats.put("recentSales", recentSales);
        stats.put("recentStockActivities", recentStock);

        return stats;
    }
}
