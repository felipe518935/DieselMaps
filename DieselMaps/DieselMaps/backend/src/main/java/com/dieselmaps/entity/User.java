package com.dieselmaps.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data                    // Lombok: genera getters, setters, toString
@NoArgsConstructor       // Constructor vacío
@AllArgsConstructor      // Constructor con todos los campos
@Builder                 // Patrón builder para crear objetos
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;      // Guardamos hash BCrypt, nunca texto plano

    @Column(length = 20)
    private String phone;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;    // Valor por defecto: usuario normal

    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist                       // Se ejecuta antes de guardar en DB
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Enum de roles anidado en la misma clase
    public enum Role {
        USER, OPERATOR, ADMIN
    }
}