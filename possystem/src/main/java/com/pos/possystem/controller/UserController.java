package com.pos.possystem.controller;

import com.pos.possystem.dto.RegisterRequest;
import com.pos.possystem.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 🔐 MANAGER CREATES USER
    @PostMapping("/create")
    public String createUser(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }
}