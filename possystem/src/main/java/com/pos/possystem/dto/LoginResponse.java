package com.pos.possystem.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String message;

    // SUCCESS constructor
    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
        this.message = null;
    }

    // ERROR constructor
    public LoginResponse(String message) {
        this.message = message;
        this.token = null;
        this.role = null;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}