package com.pos.possystem.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "restock_history")
public class RestockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String barcode;

    private String productName;

    private int quantityAdded;

    private String performedBy;

    private Instant createdAt = Instant.now();

    // GETTERS & SETTERS

    public Long getId() { return id; }

    public String getBarcode() { return barcode; }

    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getProductName() { return productName; }

    public void setProductName(String productName) { this.productName = productName; }

    public int getQuantityAdded() { return quantityAdded; }

    public void setQuantityAdded(int quantityAdded) { this.quantityAdded = quantityAdded; }

    public String getPerformedBy() { return performedBy; }

    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public Instant getCreatedAt() { return createdAt; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}