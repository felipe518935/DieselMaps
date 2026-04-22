package com.dieselmaps.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre de usuario es requerido")
    @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "El correo es requerido")
    @Email(message = "Formato de correo inválido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = ".*[A-Z].*", message = "La contraseña debe tener al menos una mayúscula")
    private String password;

    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Teléfono inválido")
    private String phone;

    @NotNull(message = "La fecha de nacimiento es requerida")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate birthDate;

    @NotBlank(message = "El rol es requerido")
    @Pattern(regexp = "USER|OPERATOR", message = "El rol debe ser USER u OPERATOR")
    private String role;
}