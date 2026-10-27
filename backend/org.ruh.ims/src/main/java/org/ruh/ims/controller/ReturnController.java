package org.ruh.ims.controller;

import org.ruh.ims.model.ProductReturn;
import org.ruh.ims.service.ReturnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/returns")
public class ReturnController {
    @Autowired
    private ReturnService returnService;

    @GetMapping
    public List<ProductReturn> getAll() {
        return returnService.getAllReturns();
    }

    @PostMapping
    public ResponseEntity<ProductReturn> create(@RequestBody ProductReturn productReturn) {
        return ResponseEntity.status(201).body(returnService.createReturn(productReturn));
    }
}
