package com.pos.possystem.config;

import com.pos.possystem.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // AUTH
                        // =========================
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/reset-password").authenticated()

                        // =========================
                        // PRODUCTS
                        // =========================
                        .requestMatchers(HttpMethod.GET, "/api/products/**")
                        .hasAnyRole("CASHIER", "MANAGER")

                        .requestMatchers(HttpMethod.POST, "/api/products")
                        .hasAnyRole("CASHIER", "MANAGER")

                        .requestMatchers(HttpMethod.PUT, "/api/products/restock/**")
                        .hasAnyRole("CASHIER", "MANAGER")

                        .requestMatchers(HttpMethod.PUT, "/api/products/update-price/**")
                        .hasRole("MANAGER")

                        .requestMatchers("/api/products/restocks/recent")
                        .hasRole("MANAGER")

                        // =========================
                        // SALES (NEW ADDED SECTION)
                        // =========================

                        // CASHIER + MANAGER → checkout sale
                        .requestMatchers("/api/sales/checkout")
                        .hasAnyRole("CASHIER", "MANAGER")

                        // CASHIER + MANAGER → view today sales
                        .requestMatchers("/api/sales/today")
                        .hasAnyRole("CASHIER", "MANAGER")

                        // MANAGER ONLY → sales reports
                        .requestMatchers("/api/sales/by-date")
                        .hasRole("MANAGER")

                        .requestMatchers("/api/sales/by-date-range")
                        .hasRole("MANAGER")

                        .requestMatchers("/api/sales/*")
                        .hasRole("MANAGER")

                        // =========================
                        // USERS
                        // =========================
                        .requestMatchers("/api/users/create")
                        .hasRole("MANAGER")

                        // =========================
                        // OPTIONS
                        // =========================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // =========================
                        // DEFAULT
                        // =========================
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}