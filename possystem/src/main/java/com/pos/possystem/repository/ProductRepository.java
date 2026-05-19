package com.pos.possystem.repository;

import com.pos.possystem.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    Optional<Product> findByBarcode(String barcode);

    Optional<Product> findByInternalCode(String internalCode);

    boolean existsByBarcode(String barcode);

    boolean existsByInternalCode(String internalCode);

    boolean existsByName(String name);

    List<Product> findByNameContainingIgnoreCaseOrderByNameAsc(
            String name
    );
}