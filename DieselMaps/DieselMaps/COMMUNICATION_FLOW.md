# 🔄 DieselMaps - Flujo de Comunicación Frontend ↔️ Backend

## 1️⃣ Flujo de Registro

```
┌──────────────────────────────────────┐
│  FRONTEND - React (Login Page)       │
└──────────────────────────────────────┘
          ↓
    [Usuario completa form]
    - username: "juan_doe"
    - email: "juan@example.com"
    - password: "Password123"
    - phone: "+57 301 234 5678"
    - birthDate: "1990-05-15"
          ↓
    [authAPI.register(data)]
          ↓
┌──────────────────────────────────────┐
│  BACKEND - Spring Boot               │
│  POST /api/auth/register             │
└──────────────────────────────────────┘
          ↓
    [AuthController.register()]
          ↓
    [AuthService.register()]
    ├─ Validar email único
    ├─ Hash password con BCrypt
    ├─ Guardar User en MySQL
    └─ Generar JWT Token
          ↓
    [JwtUtil.generateToken()]
    ├─ Sign with secret key
    ├─ Add claims (username, role)
    ├─ Set expiration (24h)
    └─ Return token
          ↓
    Response:
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "username": "juan_doe",
      "role": "USER"
    }
          ↓
┌──────────────────────────────────────┐
│  FRONTEND - React (AuthContext)      │
└──────────────────────────────────────┘
          ↓
    [useAuth().login()]
    ├─ Save token in state
    ├─ Save to localStorage
    ├─ Save user info
    └─ Redirect to /map
```

---

## 2️⃣ Flujo de Login

```
┌──────────────────────────────────────┐
│  FRONTEND - React (Login Page)       │
└──────────────────────────────────────┘
          ↓
    [Usuario entra credenciales]
    - email: "juan@example.com"
    - password: "Password123"
          ↓
    [authAPI.login(data)]
          ↓
┌──────────────────────────────────────┐
│  BACKEND - Spring Boot               │
│  POST /api/auth/login                │
└──────────────────────────────────────┘
          ↓
    [AuthController.login()]
          ↓
    [AuthService.login()]
    ├─ Buscar usuario por email
    ├─ Comparar password con hash
    │  (BCryptPasswordEncoder.matches)
    ├─ Si es incorrecto: throw error
    └─ Si es correcto: generar JWT
          ↓
    Response: { token, username, role }
          ↓
┌──────────────────────────────────────┐
│  FRONTEND - React                    │
└──────────────────────────────────────┘
          ↓
    [localStorage.setItem('dieselmaps_token', token)]
    ✅ Usuario autenticado
```

---

## 3️⃣ Flujo de Petición Autenticada (ej: Buscar Estaciones Cercanas)

```
┌──────────────────────────────────────┐
│  FRONTEND - React (Map Component)    │
└──────────────────────────────────────┘
          ↓
    [useGeolocation()]
    → Obtiene lat/lng del usuario
    → lat: 4.711, lng: -74.0721
          ↓
    [stationsAPI.getNearby(4.711, -74.0721, 5)]
          ↓
    GET /api/stations/public/nearby?lat=4.711&lng=-74.0721&radiusKm=5
          ↓
┌──────────────────────────────────────┐
│  AXIOS INTERCEPTOR (auth.js)         │
└──────────────────────────────────────┘
          ↓
    [API.interceptors.request.use()]
    ├─ Lee token de localStorage
    ├─ Agrega header:
    │  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    └─ Continúa request
          ↓
┌──────────────────────────────────────┐
│  BACKEND - Spring Boot               │
│  GET /api/stations/public/nearby     │
└──────────────────────────────────────┘
          ↓
    [JwtFilter.doFilterInternal()]
    ├─ Extrae header Authorization
    ├─ Extrae token (sin "Bearer ")
    ├─ Valida token con JwtUtil
    │  ├─ Decodifica JWT
    │  ├─ Verifica signature
    │  ├─ Verifica expiration
    │  └─ Si es válido: continúa
    └─ Si es inválido: devuelve 401
          ↓
    [JwtUtil.validateToken()]
    └─ Usa Jwts.parser() con verifyingKey
          ↓
    [SecurityContext.setAuthentication()]
    └─ Registra usuario autenticado
          ↓
    [StationController.getNearby()]
          ↓
    [StationService.findNearby()]
    ├─ Busca usuarios en radio de 5 km
    ├─ Usa Haversine formula en SQL:
    │  SELECT * FROM stations WHERE
    │    (6371 * acos(...)) <= 5
    └─ Convierte a DTOs
          ↓
    Response: [
      {
        "id": 1,
        "name": "Estación Central",
        "latitude": 4.711,
        "longitude": -74.0721,
        "prices": [
          { "fuelType": "DIESEL", "priceCop": 12500 },
          { "fuelType": "CORRIENTE", "priceCop": 11200 }
        ]
      },
      ...más estaciones...
    ]
          ↓
┌──────────────────────────────────────┐
│  FRONTEND - React (Map Component)    │
└──────────────────────────────────────┘
          ↓
    [Re-renders MapView]
    ├─ Pinta markers en Google Maps
    ├─ Muestra precios en tarjetas
    └─ Usuario ve estaciones cercanas
```

---

## 4️⃣ Flujo de Actualización de Precio (Operador)

```
┌──────────────────────────────────────┐
│  FRONTEND - React (StationDetail)    │
└──────────────────────────────────────┘
          ↓
    [Solo visible si user.role = OPERATOR/ADMIN]
    ├─ Form con select fuel type
    ├─ Input con nuevo precio
    └─ Button "Actualizar"
          ↓
    [Usuario ingresa precio]
    - fuelType: "DIESEL"
    - priceCop: "12750.50"
          ↓
    [stationsAPI.updatePrice(stationId, data)]
          ↓
    PATCH /api/stations/1/prices
    Headers:
    - Authorization: Bearer <token>
    - Content-Type: application/json
    Body:
    {
      "fuelType": "DIESEL",
      "priceCop": 12750.50
    }
          ↓
┌──────────────────────────────────────┐
│  AXIOS INTERCEPTOR                   │
└──────────────────────────────────────┘
          ↓
    [Agrega Authorization header + token]
          ↓
┌──────────────────────────────────────┐
│  BACKEND - Spring Boot               │
│  PATCH /api/stations/{id}/prices     │
└──────────────────────────────────────┘
          ↓
    [JwtFilter valida token]
          ↓
    [@PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")]
    ├─ Extrae rol del token
    ├─ Verifica si es OPERATOR o ADMIN
    └─ Si no: devuelve 403 Forbidden
          ↓
    [StationController.updatePrice()]
          ↓
    [StationService.updatePrice()]
    ├─ Busca estación
    ├─ Busca FuelPrice existente
    ├─ Guarda prevPriceCop (historial)
    ├─ Guarda nuevo priceCop
    ├─ Guarda timestamp (recordedAt)
    └─ Guarda cambios en MySQL
          ↓
    [FuelPrice actualizado con audit trail]
    Before:
    {
      "id": 10,
      "fuelType": "DIESEL",
      "priceCop": 12500,
      "prevPriceCop": null
    }
          ↓
    After:
    {
      "id": 10,
      "fuelType": "DIESEL",
      "priceCop": 12750.50,
      "prevPriceCop": 12500,
      "recordedAt": "2026-04-08 14:30:45"
    }
          ↓
    Response: { success }
          ↓
┌──────────────────────────────────────┐
│  FRONTEND - React                    │
└──────────────────────────────────────┘
          ↓
    [Re-carga estación desde backend]
    ✅ Muestra nuevo precio
    ✅ Muestra precio anterior para comparar
```

---

## 5️⃣ Flujo de Error - Token Expirado

```
┌──────────────────────────────────────┐
│  FRONTEND - React                    │
│  [Intenta hacer GET a /api/stations]  │
└──────────────────────────────────────┘
          ↓
    [AXIOS INTERCEPTOR agrega token]
    Authorization: Bearer <token_expirado>
          ↓
┌──────────────────────────────────────┐
│  BACKEND - Spring Boot               │
│  [JwtFilter.doFilterInternal()]       │
└──────────────────────────────────────┘
          ↓
    [JwtUtil.validateToken()]
    └─ Detecta: Token expirado
          ↓
    ❌ JwtException thrown
    └─ Continúa sin autenticación
          ↓
    [StationController endpoint requires auth]
    └─ Devuelve 401 Unauthorized
          ↓
┌──────────────────────────────────────┐
│  FRONTEND - AXIOS RESPONSE INTERCEPTOR│
└──────────────────────────────────────┘
          ↓
    [API.interceptors.response.use()]
    if (error.response?.status === 401)
    ├─ localStorage.clear()
    ├─ window.location.href = '/login'
    └─ Usuario redirigido a login
          ↓
    ✅ Usuario debe ingresar nuevamente
```

---

## 6️⃣ Componentes Clave en la Integración

### Backend (Spring Boot)

**Producción del Token:**
```
Solicitud de registro/login
    ↓
AuthService.register() / AuthService.login()
    ↓
JwtUtil.generateToken(username, role)
    ↓
Jwts.builder().signWith(secret, HS256).compact()
    ↓
JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Validación del Token:**
```
Petición autenticada con Authorization header
    ↓
JwtFilter.doFilterInternal()
    ↓
JwtUtil.validateToken()
    ↓
Jwts.parser().verifyingKey(key).parseSignedClaims(token)
    ↓
Claims extraídas → Renovación de SecurityContext
```

### Frontend (React)

**Almacenamiento:**
```
AuthContext.login()
    ↓
localStorage.setItem('dieselmaps_token', token)
localStorage.setItem('dieselmaps_user', JSON.stringify(user))
    ↓
useAuth() hook → Acceso disponible en toda la app
```

**Inyección en Peticiones:**
```
Axios Interceptor (auth.js)
    ↓
En cada request:
  const token = localStorage.getItem('dieselmaps_token')
  config.headers.Authorization = `Bearer ${token}`
    ↓
Header incluido automáticamente en todas las peticiones
```

---

## 🔑 Seguridad en Cada Capa

| Capa | Mecanismo |
|------|-----------|
| **Base de Datos** | Contraseñas hasheadas con BCrypt |
| **Transport** | JWT en header Authorization |
| **Backend** | JwtFilter + @PreAuthorize |
| **Frontend** | AuthContext + Protected Routes |

