package com.pos.possystem.dto;

import com.pos.possystem.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String username;

    private String password;

    private Role role;
}