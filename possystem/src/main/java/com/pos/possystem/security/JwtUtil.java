package com.pos.possystem.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import com.pos.possystem.entity.Role;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "my_secret_key_my_secret_key_my_secret_key_12345";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // =========================
    // GENERATE TOKEN
    // =========================
    public String generateToken(String username, Role role) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.name()) // MANAGER / CASHIER
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 19)
                )
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // EXTRACT USERNAME
    // =========================
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // =========================
    // EXTRACT ROLE (SAFE)
    // =========================
    public String extractRole(String token) {

        String role = getClaims(token).get("role", String.class);

        // 🔥 SAFETY FIX
        return (role != null) ? role.toUpperCase() : null;
    }

    // =========================
    // GET CLAIMS
    // =========================
    private Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}