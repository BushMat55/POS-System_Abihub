package com.pos.possystem.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String barcode;

    // NEW INTERNAL CODE
    @Column(unique = true)
    private String internalCode;

    @Column(unique = true)
    private String name;

    private double price;

    private int quantity;

    private String category;

    private int lowStockThreshold = 5;

    private boolean autoRestocked = false;

    private String stockStatus;

    private Instant lastSoldAt;

    private Instant lastRestockedAt;

    @PrePersist
    @PreUpdate
    public void updateStockStatus() {

        if (quantity < 0) {

            stockStatus = "PENDING_RESTOCK";
        }

        else if (quantity == 0) {

            stockStatus = "OUT_OF_STOCK";
        }

        else if (quantity <= lowStockThreshold) {

            stockStatus = "LOW_STOCK";
        }

        else {

            stockStatus = "IN_STOCK";
        }
    }

    public Long getId() {
        return id;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    // INTERNAL CODE
    public String getInternalCode() {
        return internalCode;
    }

    public void setInternalCode(String internalCode) {
        this.internalCode = internalCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(int lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public boolean isAutoRestocked() {
        return autoRestocked;
    }

    public void setAutoRestocked(boolean autoRestocked) {
        this.autoRestocked = autoRestocked;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }

    public Instant getLastSoldAt() {
        return lastSoldAt;
    }

    public void setLastSoldAt(Instant lastSoldAt) {
        this.lastSoldAt = lastSoldAt;
    }

    public Instant getLastRestockedAt() {
        return lastRestockedAt;
    }

    public void setLastRestockedAt(Instant lastRestockedAt) {
        this.lastRestockedAt = lastRestockedAt;
    }
}