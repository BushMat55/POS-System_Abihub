package com.pos.possystem.service;

import com.pos.possystem.dto.LoginRequest;
import com.pos.possystem.dto.LoginResponse;
import com.pos.possystem.dto.RegisterRequest;
import com.pos.possystem.dto.ResetPasswordRequest;
import com.pos.possystem.entity.User;
import com.pos.possystem.repository.UserRepository;
import com.pos.possystem.security.JwtUtil;
import com.pos.possystem.security.SecurityUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuditService auditService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuditService auditService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.auditService = auditService;
    }

    // =========================
    // PASSWORD VALIDATION
    // =========================
    private boolean isValidPassword(String password) {

        if (password == null) return false;

        if (password.length() < 8) return false;

        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasNumber = password.matches(".*[0-9].*");

        return hasUpper && hasLower && hasNumber;
    }

    // =========================
    // REGISTER USER + AUDIT
    // =========================
    public String register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return "Username already exists";
        }

        if (!isValidPassword(request.getPassword())) {
            return "Password must be at least 8 characters and include uppercase, lowercase, numbers";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getRole() == null) {
            throw new RuntimeException("Role is required");
        }

        user.setRole(request.getRole());

        userRepository.save(user);

        // 🔥 AUDIT LOG
        auditService.log(
                SecurityUtil.getUsername(),
                SecurityUtil.getRole(),
                "REGISTER_USER",
                "Created user: " + request.getUsername() +
                        " with role: " + request.getRole()
        );

        return "User registered successfully";
    }

    // =========================
    // LOGIN + AUDIT
    // =========================
    public LoginResponse login(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByUsername(request.getUsername());

        if (optionalUser.isEmpty()) {

            auditService.log(
                    request.getUsername(),
                    "UNKNOWN",
                    "LOGIN_FAILED",
                    "User not found"
            );

            return new LoginResponse("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            auditService.log(
                    user.getUsername(),
                    user.getRole().name(),
                    "LOGIN_FAILED",
                    "Invalid password attempt"
            );

            return new LoginResponse("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        // 🔥 AUDIT LOG SUCCESS LOGIN
        auditService.log(
                user.getUsername(),
                user.getRole().name(),
                "LOGIN_SUCCESS",
                "User logged in successfully"
        );

        return new LoginResponse(token, user.getRole().name());
    }

    // =========================
    // RESET PASSWORD + AUDIT
    // =========================
    public String resetPassword(ResetPasswordRequest request, String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "Unauthorized request";
        }

        String token = authHeader.substring(7);

        String username = jwtUtil.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        boolean matches = passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        );

        if (!matches) {

            auditService.log(
                    username,
                    user.getRole().name(),
                    "PASSWORD_RESET_FAILED",
                    "Incorrect current password"
            );

            return "Current password is incorrect";
        }

        if (!isValidPassword(request.getNewPassword())) {
            return "Password must be at least 8 characters with uppercase, lowercase and number";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // 🔥 AUDIT LOG SUCCESS RESET
        auditService.log(
                username,
                user.getRole().name(),
                "PASSWORD_RESET",
                "Password successfully changed"
        );

        return "Password updated successfully. Please login again.";
    }
}