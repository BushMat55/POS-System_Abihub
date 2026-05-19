package com.pos.possystem.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String role;
    private String action;
    private String details;

    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(String username, String role, String action, String details) {
        this.username = username;
        this.role = role;
        this.action = action;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    // getters and setters
}