package com.dieselmaps.service;

import com.dieselmaps.dto.*;
import com.dieselmaps.entity.User;
import com.dieselmaps.repository.UserRepository;
import com.dieselmaps.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        // Verificar que el email no exista ya
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Validar que el rol sea USER u OPERATOR (no permitir ADMIN)
        User.Role selectedRole;
        try {
            selectedRole = User.Role.valueOf(req.getRole().toUpperCase());
            if (selectedRole == User.Role.ADMIN) {
                throw new RuntimeException("No puedes registrarte como ADMIN");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido");
        }

        // Crear el usuario con la contraseña hasheada (nunca guardamos texto plano)
        User user = User.builder()
            .username(req.getUsername())
            .email(req.getEmail())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .phone(req.getPhone())
            .birthDate(req.getBirthDate())
            .role(selectedRole)
            .build();

        userRepository.save(user);

        // Generar el token JWT y devolverlo
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
            .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        // Verificamos la contraseña contra el hash guardado
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}