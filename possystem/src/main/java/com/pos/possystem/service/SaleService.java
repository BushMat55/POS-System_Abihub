package com.pos.possystem.service;

import com.pos.possystem.dto.SaleItemRequest;
import com.pos.possystem.dto.SaleRequest;
import com.pos.possystem.entity.Sale;
import com.pos.possystem.entity.SaleItem;
import com.pos.possystem.entity.Product;
import com.pos.possystem.repository.ProductRepository;
import com.pos.possystem.repository.SaleRepository;
import com.pos.possystem.security.SecurityUtil;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final AuditService auditService;

    public SaleService(
            SaleRepository saleRepository,
            ProductRepository productRepository,
            AuditService auditService
    ) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.auditService = auditService;
    }

    @Transactional
    public Sale processSale(SaleRequest request) {

        // =========================
        // VALIDATE REQUEST
        // =========================
        if (request == null ||
                request.getItems() == null ||
                request.getItems().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sale request must contain at least one item"
            );
        }

        // =========================
        // USER DETAILS
        // =========================
        String username = SecurityUtil.getUsername();
        String role = SecurityUtil.getRole();

        // =========================
        // CREATE SALE
        // =========================
        Sale sale = new Sale();

        sale.setCashierName(username);
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setTotalAmount(request.getTotalAmount());

        // RECEIPT NUMBER
        String receiptNumber =
                "RCPT-" +
                        LocalDate.now().toString().replace("-", "") +
                        "-" +
                        UUID.randomUUID().toString().substring(0, 5);

        sale.setReceiptNumber(receiptNumber);

        sale.setCreatedAt(Instant.now());

        sale.setItems(new ArrayList<>());

        // =========================
        // PROCESS ITEMS
        // =========================
        for (SaleItemRequest itemRequest : request.getItems()) {

            if (itemRequest == null) {
                continue;
            }

            Product product = productRepository
                    .findByBarcode(itemRequest.getBarcode())
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Product not found"
                            )
                    );

            int oldQty = product.getQuantity();

            // =========================
            // AUTO RESTOCK LOGIC
            // =========================
            int newQty = oldQty - itemRequest.getQuantity();

            product.setQuantity(newQty);

            // =========================
            // AUTO STATUS
            // =========================
            if (newQty < 0) {

                product.setAutoRestocked(true);
                product.setStockStatus("PENDING_RESTOCK");
            }

            else if (newQty == 0) {

                product.setStockStatus("OUT_OF_STOCK");
            }

            else if (newQty <= product.getLowStockThreshold()) {

                product.setStockStatus("LOW_STOCK");
            }

            else {

                product.setStockStatus("IN_STOCK");
            }

            // TRACK LAST SOLD
            product.setLastSoldAt(Instant.now());

            productRepository.save(product);

            // =========================
            // CREATE SALE ITEM
            // =========================
            SaleItem saleItem = new SaleItem();

            saleItem.setBarcode(product.getBarcode());
            saleItem.setProductName(product.getName());

            saleItem.setPrice(itemRequest.getPrice());

            saleItem.setQuantity(itemRequest.getQuantity());

            saleItem.setSubtotal(itemRequest.getSubtotal());

            saleItem.setSale(sale);

            sale.getItems().add(saleItem);

            // =========================
            // AUDIT LOG
            // =========================
            auditService.log(
                    username,
                    role,
                    "SALE_ITEM",
                    "Sold " + itemRequest.getQuantity() +
                            " of " + product.getName() +
                            " | Stock: " + oldQty +
                            " -> " + newQty +
                            " | Receipt: " + receiptNumber
            );
        }

        // =========================
        // SAVE SALE
        // =========================
        Sale savedSale = saleRepository.save(sale);

        // =========================
        // FINAL AUDIT
        // =========================
        auditService.log(
                username,
                role,
                "SALE_COMPLETED",
                "Completed sale | Receipt: " +
                        receiptNumber +
                        " | Total: " +
                        request.getTotalAmount() +
                        " | Payment: " +
                        request.getPaymentMethod()
        );

        return savedSale;
    }
}