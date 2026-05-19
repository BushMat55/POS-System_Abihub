package com.pos.possystem.controller;

import com.pos.possystem.entity.Product;
import com.pos.possystem.entity.RestockHistory;
import com.pos.possystem.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, Object> createProduct(
            @RequestBody Product product
    ) {

        try {

            Product saved =
                    service.createProduct(product);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Product created successfully"
            );

            response.put("data", saved);

            return response;

        } catch (ResponseStatusException ex) {

            throw new ResponseStatusException(
                    ex.getStatusCode(),
                    ex.getReason()
            );
        }
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAllProducts();
    }

    // NEW SEARCH
    @GetMapping("/search/{keyword}")
    public Map<String, Object> searchProduct(
            @PathVariable String keyword
    ) {

        Product product =
                service.searchProduct(keyword);

        Map<String, Object> response =
                new HashMap<>();

        response.put("message", "Product found");

        response.put("data", product);

        return response;
    }

    @GetMapping("/barcode/{barcode}")
    public Map<String, Object> getByBarcode(
            @PathVariable String barcode
    ) {

        Product product =
                service.getByBarcode(barcode);

        Map<String, Object> response =
                new HashMap<>();

        response.put("message", "Product found");

        response.put("data", product);

        return response;
    }

    @PutMapping("/restock/{barcode}")
    public Product restockProduct(
            @PathVariable String barcode,
            @RequestParam int quantity
    ) {
        return service.restockProduct(
                barcode,
                quantity
        );
    }

    @PutMapping("/update-price/{barcode}")
    public Product updatePrice(
            @PathVariable String barcode,
            @RequestParam double price
    ) {
        return service.updatePrice(
                barcode,
                price
        );
    }

    @GetMapping("/restocks/recent")
    public List<RestockHistory> getRecentRestocks() {
        return service.getRecentRestocks();
    }

    @GetMapping("/search-by-name")
    public Map<String, Object> searchByName(
            @RequestParam String keyword
    ) {

        List<Product> products =
                service.searchProductsByName(keyword);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Products found");
        response.put("data", products);

        return response;
    }

}