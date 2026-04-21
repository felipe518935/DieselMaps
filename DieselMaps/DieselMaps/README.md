# 🛢️ DieselMaps - Complete Full Stack Application

Aplicación completa para encontrar y comparar precios de combustible en tiempo real, con mapas interactivos y gestión de operadores.

## 🎯 Descripción

DieselMaps es una plataforma que conecta usuarios finales con operadores de estaciones de combustible. Los usuarios pueden:

- ✅ **Buscar estaciones** por ubicación geografica (radio configurable)
- ✅ **Ver precios actuales** de diferentes tipos de combustible
- ✅ **Acceder a historial de precios** para comparar variaciones
- ✅ **Operadores pueden registrar estaciones** y actualizar precios
- ✅ **Administradores pueden gestionar** todo el sistema

---

## 🏗️ Arquitectura

```
Frontend (React 19)                Backend (Spring Boot 4.0.5)
     ↓                                   ↓
  - Vite                            - JWT + Security
  - React Router                     - MySQL 8
  - Google Maps API                  - Hibernate ORM
  - Tailwind CSS                     - REST API
  - Axios (HTTP)                     - Role-Based Access Control
```

### Stack Completo

**Frontend:**
- React 19 + Vite (Fast Refresh)
- React Router v7 (Client-side routing)
- Axios (HTTP client con JWT interceptors)
- @react-google-maps/api (Interactive maps)
- Tailwind CSS (Utility-first styling)

**Backend:**
- Spring Boot 4.0.5
- Spring Security (JWT authentication)
- Spring Data JPA (ORM)
- MySQL 8 (Relational database)
- JJWT 0.12.3 (Token management)
- Maven (Build tool)

**Database:**
- MySQL 8.0+
- Hibernate auto-schema generation
- Geospatial queries (Haversine formula)

---

## 📋 Estructura de Archivos

### Backend: 23 Java Files
```
backend/
├── src/main/java/com/dieselmaps/
│   ├── config/
│   │   └── SecurityConfig.java                (JWT + Role-based auth)
│   ├── controller/
│   │   ├── AuthController.java                (Register/Login endpoints)
│   │   └── StationController.java             (Station CRUD + Search)
│   ├── dto/
│   │   ├── RegisterRequest.java               (Validation constraints)
│   │   ├── LoginRequest.java
│   │   ├── AuthResponse.java
│   │   ├── StationDTO.java
│   │   ├── StationRequest.java
│   │   ├── FuelPriceDTO.java
│   │   └── PriceUpdateRequest.java
│   ├── entity/
│   │   ├── User.java                          (WITH ROLES + BCRYPT)
│   │   ├── Station.java                       (GEO-SPATIAL)
│   │   └── FuelPrice.java                     (WITH HISTORY)
│   ├── exception/
│   │   └── GlobalExceptionHandler.java        (Centralized error handling)
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── StationRepository.java             (Geographic queries)
│   │   └── FuelPriceRepository.java
│   ├── security/
│   │   ├── JwtUtil.java                       (JJWT 0.12.3)
│   │   ├── JwtFilter.java                     (Request interceptor)
│   │   └── CustomUserDetailsService.java
│   ├── service/
│   │   ├── AuthService.java
│   │   └── StationService.java
│   └── BackendApplication.java
├── src/main/resources/
│   └── application.properties                 (MySQL + JWT config)
└── pom.xml                                     (Dependencies)
```

### Frontend: 15 JavaScript Files
```
frontend/
├── src/
│   ├── api/
│   │   └── auth.js                            (Axios instance + interceptors)
│   ├── components/
│   │   ├── Navbar.jsx                         (Top navigation)
│   │   ├── MapView.jsx                        (Google Maps integration)
│   │   ├── StationCard.jsx                    (Station card component)
│   │   └── PriceTag.jsx                       (Price formatter)
│   ├── context/
│   │   └── AuthContext.jsx                    (Global auth state)
│   ├── pages/
│   │   ├── Login.jsx                          (Authentication)
│   │   ├── Register.jsx                       (User registration)
│   │   ├── Map.jsx                            (Main map view)
│   │   ├── StationDetail.jsx                  (Station details)
│   │   └── CreateStation.jsx                  (Operator creation form)
│   ├── hooks/
│   │   └── useGeolocation.js                  (Browser geolocation)
│   ├── App.jsx                                (React Router setup)
│   └── main.jsx                               (Entry point)
├── .env.local                                 (Google Maps API key)
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### Prerrequisitos

- **Java 17+** + Maven 3.8+
- **Node.js 16+** + npm 8+
- **MySQL 8.0+**
- **Google Maps API Key** (free tier available)

### 1. Setup Backend

```bash
# 1. Create database
mysql -u root -p
> CREATE DATABASE diesel_maps CHARACTER SET utf8mb4;

# 2. Update credentials
# backend/src/main/resources/application.properties
# spring.datasource.password=tu_password

# 3. Build and run
cd backend
mvn clean install
mvn spring-boot:run

# ✅ Backend ready at http://localhost:8080
```

### 2. Setup Frontend

```bash
# 1. Add Google Maps API key
# frontend/.env.local
# VITE_GOOGLE_MAPS_KEY=your_key_here

# 2. Install and run
cd frontend
npm install
npm run dev

# ✅ Frontend ready at http://localhost:5173
```

### 3. Test the App

```bash
# Register as user
POST http://localhost:8080/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "birthDate": "1990-01-01"
}

# Get token
POST http://localhost:8080/api/auth/login
{
  "email": "test@example.com",
  "password": "Password123"
}

# Search nearby stations
GET http://localhost:8080/api/stations/public/nearby?lat=4.711&lng=-74.0721&radiusKm=5
```

---

## 🔐 Authentication & Authorization

### Roles
- **USER** - Browse stations, view prices
- **OPERATOR** - Create/edit own stations, update prices
- **ADMIN** - Full system access

### JWT Workflow
```
1. User Registration
   → POST /auth/register
   → BCrypt hash password
   → Generate JWT token
   ← Return token + user data

2. Authenticated Request
   → Authorization: Bearer <token>
   ← JwtFilter validates token
   ← @PreAuthorize checks role
   ← Execute endpoint logic

3. Token Expiration
   → Default: 24 hours
   → Automatic logout on frontend
   → Redirect to login
```

---

## 📡 API Endpoints

### Public (No Auth Required)
```
POST   /api/auth/register                       Register new user
POST   /api/auth/login                          Authenticate user
GET    /api/stations/public/nearby?lat=&lng=&radiusKm=  Search nearby
```

### Protected (All Authenticated Users)
```
GET    /api/stations/{id}                       Get station details
```

### Protected (OPERATOR, ADMIN)
```
POST   /api/stations                            Create new station
PATCH  /api/stations/{id}/prices                Update fuel prices
```

---

## 🗺️ Key Features

### Geolocation
- Real-time browser geolocation
- Fallback to Bogotá, Colombia (4.711, -74.0721)
- Radius-based search (1-20 km configurable)
- Haversine formula for distance calculation

### Fuel Types Supported
- CORRIENTE (Regular gasoline)
- EXTRA (Premium gasoline)
- DIESEL (Diesel fuel)
- GAS (Natural gas)

### Price History
- Tracks previous price for comparison
- Records update timestamp
- Allows users to see price trends

### User Roles
- USER: Normal user, read-only
- OPERATOR: Can manage own station(s)
- ADMIN: Full administrative access

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id LONG PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  passwordHash VARCHAR NOT NULL,
  phone VARCHAR(20),
  birthDate DATE,
  role ENUM('USER', 'OPERATOR', 'ADMIN') DEFAULT 'USER',
  active BOOLEAN DEFAULT true,
  createdAt DATETIME NOT NULL
);
```

### Stations Table
```sql
CREATE TABLE stations (
  id LONG PRIMARY KEY AUTO_INCREMENT,
  operator_id LONG FOREIGN KEY,
  name VARCHAR NOT NULL,
  brand VARCHAR,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  available BOOLEAN DEFAULT true,
  updatedAt DATETIME
);
```

### FuelPrices Table
```sql
CREATE TABLE fuel_prices (
  id LONG PRIMARY KEY AUTO_INCREMENT,
  station_id LONG FOREIGN KEY NOT NULL,
  fuelType ENUM('CORRIENTE', 'EXTRA', 'DIESEL', 'GAS'),
  priceCop DECIMAL(10, 2) NOT NULL,
  prevPriceCop DECIMAL(10, 2),
  recordedAt DATETIME NOT NULL
);
```

---

## 🛠️ Development

### Build Commands

**Backend:**
```bash
cd backend

# Build JAR
mvn clean package

# Run tests
mvn test

# Run in dev mode
mvn spring-boot:run

# Clean build artifacts
mvn clean
```

**Frontend:**
```bash
cd frontend

# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

**Backend:** `backend/src/main/resources/application.properties`
- Database credentials
- JWT secret and expiration
- CORS allowed origins

**Frontend:** `frontend/.env.local`
- VITE_GOOGLE_MAPS_KEY

---

## 🧪 Testing

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@1234",
    "birthDate": "1995-05-15"
  }'

# Login and get token
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}' | jq -r '.token')

# Create station (as operator)
curl -X POST http://localhost:8080/api/stations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Station Test",
    "brand": "Terpel",
    "latitude": 4.711,
    "longitude": -74.0721,
    "address": "Test Address"
  }'
```

---

## 📚 Documentation Files

- **[SETUP.md](./SETUP.md)** - Complete installation and configuration guide
- **[COMMUNICATION_FLOW.md](./COMMUNICATION_FLOW.md)** - Detailed frontend-backend integration flows
- **[README.md](./README.md)** - This file

---

## 🐛 Troubleshooting

### MySQL Connection Error
```
Check: application.properties credentials
Run: mysql -u root -p
Show: SHOW DATABASES;
```

### JWT Token Issues
```
401 Unauthorized:
  → Token is expired (24h expiration)
  → Re-login to get new token

CORS Error:
  → Verify .allowed-origins in application.properties
  → Frontend should be on http://localhost:3000
```

### Google Maps Not Loading
```
Check: .env.local has valid VITE_GOOGLE_MAPS_KEY
Enable: Maps JavaScript API in Google Console
Verify: Billing is active (free tier has limits)
```

---

## 📦 Deployment

### Backend (Spring Boot JAR)
```bash
# Build
mvn clean package

# Run on production server
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend (Static Build)
```bash
# Build
npm run build

# Deploy 'dist' folder to:
# - Static hosting (Vercel, Netlify)
# - AWS S3 + CloudFront
# - Nginx/Apache server
```

---

## 📞 Support

Para más información o reportar issues, consulta la documentación incluida.

---

## 📝 License

Este proyecto es de código abierto y puede ser usado libremente.

---

**Creado:** Abril 2026  
**Stack:** Spring Boot 4.0.5 + React 19 + MySQL 8 + JWT Authentication  
**Status:** ✅ Production Ready
