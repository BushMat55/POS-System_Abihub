package com.pos.possystem.dto;

import java.util.List;

public class SaleRequest {

    private double totalAmount;

    private String paymentMethod;

    private List<SaleItemRequest> items;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<SaleItemRequest> getItems() {
        return items;
    }

    public void setItems(List<SaleItemRequest> items) {
        this.items = items;
    }
}