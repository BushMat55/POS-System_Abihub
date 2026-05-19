package com.pos.possystem.repository;

import com.pos.possystem.entity.RestockHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestockHistoryRepository extends JpaRepository<RestockHistory, Long> {

    List<RestockHistory> findTop50ByOrderByCreatedAtDesc();
}