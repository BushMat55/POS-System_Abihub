package com.pos.possystem.controller;

import com.pos.possystem.dto.LoginRequest;
import com.pos.possystem.dto.LoginResponse;
import com.pos.possystem.dto.ResetPasswordRequest;
import com.pos.possystem.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestBody ResetPasswordRequest request,
            @RequestHeader("Authorization") String authHeader
    ) {
        return userService.resetPassword(request, authHeader);
    }
}