package com.laura.taskmanager.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.laura.taskmanager.Repository.UserRepo;
import com.laura.taskmanager.dto.LoginRequestDTO;
import com.laura.taskmanager.dto.RegisterRequestDTO;
import com.laura.taskmanager.dto.UserResponseDTO;
import com.laura.taskmanager.infra.security.TokenService;
import com.laura.taskmanager.model.User;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final UserRepo repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Autowired
    public ApiController(UserRepo repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {
        User user = this.repository.findByuserEmail(body.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(body.password(), user.getUserPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new UserResponseDTO(user.getUserName(), token, user.getUserId()));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO body) {
        Optional<User> user = this.repository.findByuserEmail(body.email());
        if (user.isEmpty()) {
            User newUser = new User();
            newUser.setUserPassword(passwordEncoder.encode(body.password()));
            newUser.setUserEmail(body.email());
            newUser.setUserName(body.name());
            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new UserResponseDTO(newUser.getUserName(), token, newUser.getUserId()));
        }
        return ResponseEntity.badRequest().build();
    }
}
