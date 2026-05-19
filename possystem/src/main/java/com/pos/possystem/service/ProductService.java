package com.pos.possystem.service;

import com.pos.possystem.entity.RestockHistory;
import com.pos.possystem.repository.ProductRepository;
import com.pos.possystem.repository.RestockHistoryRepository;
import com.pos.possystem.security.SecurityUtil;
import com.pos.possystem.entity.Product;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final RestockHistoryRepository restockHistoryRepository;
    private final AuditService auditService;

    public ProductService(
            ProductRepository repo,
            RestockHistoryRepository restockHistoryRepository,
            AuditService auditService
    ) {
        this.repo = repo;
        this.restockHistoryRepository = restockHistoryRepository;
        this.auditService = auditService;
    }

    // CREATE PRODUCT
    public Product createProduct(Product product) {

        // BARCODE EXISTS
        if (
                product.getBarcode() != null &&
                        !product.getBarcode().isBlank() &&
                        repo.existsByBarcode(product.getBarcode())
        ) {

            Product existing =
                    repo.findByBarcode(product.getBarcode()).get();

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "⚠️ Barcode already exists! Product: "
                            + existing.getName()
            );
        }

        // INTERNAL CODE EXISTS
        if (
                product.getInternalCode() != null &&
                        !product.getInternalCode().isBlank() &&
                        repo.existsByInternalCode(product.getInternalCode())
        ) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "⚠️ Internal code already exists!"
            );
        }

        // NAME EXISTS
        if (repo.existsByName(product.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "⚠️ Product name already exists!"
            );
        }

        if (product.getLowStockThreshold() <= 0) {

            product.setLowStockThreshold(5);
        }

        product.setAutoRestocked(false);

        product.setLastRestockedAt(Instant.now());

        updateStockStatus(product);

        Product saved = repo.save(product);

        auditService.log(
                SecurityUtil.getUsername(),
                SecurityUtil.getRole(),
                "CREATE_PRODUCT",
                "Created product: "
                        + product.getName()
        );

        return saved;
    }

    // SEARCH PRODUCT
    public Product searchProduct(String keyword) {

        // BARCODE
        var byBarcode = repo.findByBarcode(keyword);

        if (byBarcode.isPresent()) {
            return byBarcode.get();
        }

        // INTERNAL CODE
        var byCode = repo.findByInternalCode(keyword);

        if (byCode.isPresent()) {
            return byCode.get();
        }

        // NAME
        List<Product> byName =
                repo.findByNameContainingIgnoreCaseOrderByNameAsc(keyword);

        if (!byName.isEmpty()) {
            return byName.get(0);
        }

        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Product not found"
        );
    }

    public List<Product> searchProductsByName(String keyword) {

        List<Product> results =
                repo.findByNameContainingIgnoreCaseOrderByNameAsc(keyword);

        if (results.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No products found"
            );
        }

        return results;
    }

    public Product restockProduct(
            String barcode,
            int quantity
    ) {

        Product product = repo.findByBarcode(barcode)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"
                        )
                );

        product.setQuantity(
                product.getQuantity() + quantity
        );

        product.setLastRestockedAt(Instant.now());

        updateStockStatus(product);

        Product updatedProduct = repo.save(product);

        RestockHistory history = new RestockHistory();

        history.setBarcode(product.getBarcode());

        history.setProductName(product.getName());

        history.setQuantityAdded(quantity);

        history.setPerformedBy(SecurityUtil.getUsername());

        restockHistoryRepository.save(history);

        return updatedProduct;
    }

    public Product updatePrice(
            String barcode,
            double newPrice
    ) {

        Product product = repo.findByBarcode(barcode)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"
                        )
                );

        product.setPrice(newPrice);

        return repo.save(product);
    }

    public List<Product> getAllProducts() {

        return repo.findAll()
                .stream()
                .sorted((a, b) ->
                        a.getName()
                                .compareToIgnoreCase(b.getName())
                )
                .toList();
    }

    public Product getByBarcode(String barcode) {

        return repo.findByBarcode(barcode)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"
                        )
                );
    }

    public List<RestockHistory> getRecentRestocks() {

        return restockHistoryRepository
                .findTop50ByOrderByCreatedAtDesc();
    }

    private void updateStockStatus(Product product) {

        int qty = product.getQuantity();

        if (qty < 0) {

            product.setStockStatus("PENDING_RESTOCK");
        }

        else if (qty == 0) {

            product.setStockStatus("OUT_OF_STOCK");
        }

        else if (qty <= product.getLowStockThreshold()) {

            product.setStockStatus("LOW_STOCK");
        }

        else {

            product.setStockStatus("IN_STOCK");
        }
    }
}