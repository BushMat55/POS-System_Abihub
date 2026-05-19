package com.pos.possystem.controller;

import com.pos.possystem.dto.SaleRequest;
import com.pos.possystem.entity.Sale;
import com.pos.possystem.repository.SaleRepository;
import com.pos.possystem.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin
public class SaleController {

    private final SaleService service;
    private final SaleRepository saleRepository;

    public SaleController(SaleService service, SaleRepository saleRepository) {
        this.service = service;
        this.saleRepository = saleRepository;
    }

    // =========================
    // 1. CHECKOUT (CASHIER)
    // =========================
    @PostMapping("/checkout")
    public Sale checkout(@RequestBody SaleRequest request) {
        return service.processSale(request);
    }

    // =========================
    // 2. GET SALES BY DATE (MANAGER UI)
    // =========================
    @GetMapping("/by-date")
    public List<Sale> getSalesByDate(@RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date);

        return saleRepository.findByDate(localDate);
    }

    // =========================
    // 3. GET SINGLE SALE (DETAIL VIEW)
    // =========================
    @GetMapping("/{id}")
    public Sale getSaleById(@PathVariable Long id) {

        return saleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Sale not found")
                );
    }

    @GetMapping("/by-date-range")
    public List<Sale> getSalesByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return saleRepository.findByDateRange(start, end);
    }
    // =========================
    // 4. GET TODAY SALES (CASHIER)
    // =========================
    @GetMapping("/today")
    public List<Sale> getTodaySales() {

        LocalDate today = LocalDate.now();

        return saleRepository.findByDate(today);
    }

}