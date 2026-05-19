package com.pos.possystem.service;

import com.pos.possystem.entity.AuditLog;
import com.pos.possystem.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void log(String username, String role, String action, String details) {

        AuditLog log = new AuditLog(username, role, action, details);

        repository.save(log);
    }
}