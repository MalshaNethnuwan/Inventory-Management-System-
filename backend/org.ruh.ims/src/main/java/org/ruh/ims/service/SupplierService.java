package org.ruh.ims.service;

import org.ruh.ims.model.Supplier;
import org.ruh.ims.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(String id, Supplier updated) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setSupplierName(updated.getSupplierName());
        supplier.setContactNumber(updated.getContactNumber());
        supplier.setEmail(updated.getEmail());
        supplier.setAddress(updated.getAddress());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(String id) {
        supplierRepository.deleteById(id);
    }
}
