package com.pos.possystem.repository;

import com.pos.possystem.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("""
        SELECT s FROM Sale s
        WHERE DATE(s.createdAt) = :date
        ORDER BY s.id DESC
    """)
    List<Sale> findByDate(@Param("date") LocalDate date);

    @Query("""
    SELECT s FROM Sale s
    WHERE DATE(s.createdAt) BETWEEN :startDate AND :endDate
    ORDER BY s.createdAt DESC
""")
    List<Sale> findByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}