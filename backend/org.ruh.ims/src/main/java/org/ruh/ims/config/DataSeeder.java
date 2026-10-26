package org.ruh.ims.config;

import org.ruh.ims.model.*;
import org.ruh.ims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired private SaleRepository saleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("[DataSeeder] Data already exists. Skipping seed.");
            return;
        }

        System.out.println("[DataSeeder] Seeding sample data...");

        // --- USERS ---
        User admin = new User(null, "Admin User", "admin@ims.com", passwordEncoder.encode("admin123"), "ADMIN", false);
        User manager = new User(null, "Inventory Manager", "manager@ims.com", passwordEncoder.encode("manager123"), "INVENTORY_MANAGER", false);
        User sales = new User(null, "Sales Staff", "sales@ims.com", passwordEncoder.encode("sales123"), "SALES_STAFF", false);
        userRepository.saveAll(Arrays.asList(admin, manager, sales));

        // --- CATEGORIES ---
        Category electronics = categoryRepository.save(new Category(null, "Electronics", "Electronic devices and accessories"));
        Category furniture = categoryRepository.save(new Category(null, "Furniture", "Office and home furniture"));
        Category officeSupplies = categoryRepository.save(new Category(null, "Office Supplies", "Stationery and office materials"));
        Category clothing = categoryRepository.save(new Category(null, "Clothing", "Apparel and garments"));
        Category food = categoryRepository.save(new Category(null, "Food & Beverages", "Food and drink items"));

        // --- SUPPLIERS ---
        Supplier supplier1 = supplierRepository.save(new Supplier(null, "TechWorld Suppliers", "0771234567", "tech@techworld.com", "Colombo 03"));
        Supplier supplier2 = supplierRepository.save(new Supplier(null, "Office Pro Ltd", "0777654321", "info@officepro.com", "Kandy"));
        Supplier supplier3 = supplierRepository.save(new Supplier(null, "Global Traders", "0112345678", "sales@globaltraders.com", "Galle"));
        Supplier supplier4 = supplierRepository.save(new Supplier(null, "Prime Distributors", "0769876543", "contact@prime.com", "Negombo"));

        // --- PRODUCTS ---
        Product p1 = productRepository.save(new Product(null, "P001", "Laptop", "High performance office laptop", 150000.0, 20, 5, electronics.getId(), supplier1.getId(), "AVAILABLE"));
        Product p2 = productRepository.save(new Product(null, "P002", "Wireless Mouse", "Ergonomic wireless mouse", 2500.0, 50, 10, electronics.getId(), supplier1.getId(), "AVAILABLE"));
        Product p3 = productRepository.save(new Product(null, "P003", "USB Keyboard", "Mechanical USB keyboard", 3500.0, 30, 8, electronics.getId(), supplier1.getId(), "AVAILABLE"));
        Product p4 = productRepository.save(new Product(null, "P004", "Office Chair", "Ergonomic office chair with lumbar support", 25000.0, 15, 3, furniture.getId(), supplier2.getId(), "AVAILABLE"));
        Product p5 = productRepository.save(new Product(null, "P005", "Standing Desk", "Adjustable height standing desk", 45000.0, 4, 2, furniture.getId(), supplier2.getId(), "LOW_STOCK"));
        Product p6 = productRepository.save(new Product(null, "P006", "A4 Paper (Ream)", "80gsm A4 copy paper", 1200.0, 200, 50, officeSupplies.getId(), supplier3.getId(), "AVAILABLE"));
        Product p7 = productRepository.save(new Product(null, "P007", "Ballpoint Pens (Box)", "Blue ballpoint pens, 12 per box", 350.0, 80, 20, officeSupplies.getId(), supplier3.getId(), "AVAILABLE"));
        Product p8 = productRepository.save(new Product(null, "P008", "Printer Ink Cartridge", "Black ink cartridge compatible", 1800.0, 2, 5, electronics.getId(), supplier1.getId(), "LOW_STOCK"));
        Product p9 = productRepository.save(new Product(null, "P009", "Whiteboard Marker Set", "Assorted color whiteboard markers", 650.0, 0, 10, officeSupplies.getId(), supplier3.getId(), "OUT_OF_STOCK"));
        Product p10 = productRepository.save(new Product(null, "P010", "Filing Cabinet", "3-drawer metal filing cabinet", 18000.0, 8, 2, furniture.getId(), supplier2.getId(), "AVAILABLE"));

        // --- PURCHASE ORDERS ---
        PurchaseOrderItem poi1 = new PurchaseOrderItem(p1.getId(), p1.getProductName(), 5, 140000.0, 700000.0);
        PurchaseOrderItem poi2 = new PurchaseOrderItem(p2.getId(), p2.getProductName(), 20, 2200.0, 44000.0);
        PurchaseOrder po1 = new PurchaseOrder(null, "PO-001", supplier1.getId(),
                LocalDateTime.now().minusDays(5),
                Arrays.asList(poi1, poi2), 744000.0, "PENDING");
        purchaseOrderRepository.save(po1);

        PurchaseOrderItem poi3 = new PurchaseOrderItem(p4.getId(), p4.getProductName(), 10, 23000.0, 230000.0);
        PurchaseOrder po2 = new PurchaseOrder(null, "PO-002", supplier2.getId(),
                LocalDateTime.now().minusDays(10),
                Arrays.asList(poi3), 230000.0, "APPROVED");
        purchaseOrderRepository.save(po2);

        PurchaseOrderItem poi4 = new PurchaseOrderItem(p6.getId(), p6.getProductName(), 100, 1100.0, 110000.0);
        PurchaseOrderItem poi5 = new PurchaseOrderItem(p7.getId(), p7.getProductName(), 50, 320.0, 16000.0);
        PurchaseOrder po3 = new PurchaseOrder(null, "PO-003", supplier3.getId(),
                LocalDateTime.now().minusDays(2),
                Arrays.asList(poi4, poi5), 126000.0, "COMPLETED");
        purchaseOrderRepository.save(po3);

        // --- SALES ---
        SaleItem si1 = new SaleItem(p1.getId(), p1.getProductName(), 1, 150000.0, 150000.0);
        SaleItem si2 = new SaleItem(p2.getId(), p2.getProductName(), 2, 2500.0, 5000.0);
        Sale sale1 = new Sale(null, "INV-001", LocalDateTime.now().minusDays(3),
                "John Silva", Arrays.asList(si1, si2), 155000.0, "sales@ims.com");
        saleRepository.save(sale1);

        SaleItem si3 = new SaleItem(p3.getId(), p3.getProductName(), 1, 3500.0, 3500.0);
        SaleItem si4 = new SaleItem(p6.getId(), p6.getProductName(), 5, 1200.0, 6000.0);
        Sale sale2 = new Sale(null, "INV-002", LocalDateTime.now().minusDays(2),
                "Mary Perera", Arrays.asList(si3, si4), 9500.0, "sales@ims.com");
        saleRepository.save(sale2);

        SaleItem si5 = new SaleItem(p4.getId(), p4.getProductName(), 2, 25000.0, 50000.0);
        Sale sale3 = new Sale(null, "INV-003", LocalDateTime.now().minusDays(1),
                "David Fernando", Arrays.asList(si5), 50000.0, "sales@ims.com");
        saleRepository.save(sale3);

        SaleItem si6 = new SaleItem(p7.getId(), p7.getProductName(), 3, 350.0, 1050.0);
        SaleItem si7 = new SaleItem(p3.getId(), p3.getProductName(), 1, 3500.0, 3500.0);
        Sale sale4 = new Sale(null, "INV-004", LocalDateTime.now().minusHours(5),
                "Sarah Johnson", Arrays.asList(si6, si7), 4550.0, "sales@ims.com");
        saleRepository.save(sale4);

        SaleItem si8 = new SaleItem(p2.getId(), p2.getProductName(), 3, 2500.0, 7500.0);
        Sale sale5 = new Sale(null, "INV-005", LocalDateTime.now().minusHours(2),
                "Walk-in Customer", Arrays.asList(si8), 7500.0, "sales@ims.com");
        saleRepository.save(sale5);

        System.out.println("[DataSeeder] Sample data seeded successfully!");
    }
}
