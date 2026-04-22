# 🛢️ DieselMaps - Guía de Instalación y Ejecución

## 📋 Requisitos

- **Backend:** Java 17+, Maven 3.8+, MySQL 8.0+
- **Frontend:** Node.js 16+, npm 8+
- **API de Google Maps:** Una clave API válida

## 🚀 Setup del Backend

### 1. Base de Datos MySQL

```sql
CREATE DATABASE diesel_maps CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar `application.properties`

Archivo: `backend/src/main/resources/application.properties`

```properties
# Servidor
server.port=8080

# Base de datos - ACTUALIZA TUS CREDENCIALES
spring.datasource.url=jdbc:mysql://localhost:3306/diesel_maps?useSSL=false&serverTimezone=America/Bogota
spring.datasource.username=root
spring.datasource.password=tu_password_aqui

# JWT
app.jwt.secret=diesel_maps_secret_key_muy_larga_y_segura_2024
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000
```

### 3. Construir Backend

```bash
cd backend
mvn clean install
```

### 4. Ejecutar Backend

```bash
mvn spring-boot:run
# o
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

✅ Backend disponible en: http://localhost:8080

---

## 🎨 Setup del Frontend

### 1. Obtener Google Maps API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita **Maps JavaScript API**
4. Crea una credencial de tipo **API Key**
5. Copia la clave

### 2. Configurar Variables de Entorno

Archivo: `frontend/.env.local`

```
VITE_GOOGLE_MAPS_KEY=tu_google_maps_api_key_aqui
```

### 3. Instalar Dependencias

```bash
cd frontend
npm install
```

### 4. Ejecutar Frontend (Desarrollo)

```bash
npm run dev
```

✅ Frontend disponible en: http://localhost:5173

---

## 🔗 Flujo de Autenticación

### 1. registro/login
```
Usuario → React Form → POST /api/auth/register o /api/auth/login
                                    ↓
                          Spring Boot AuthService
                                    ↓
                    BCrypt Password Hashing + JWT Generation
                                    ↓
                    Response: { token, username, role }
                                    ↓
                          React AuthContext (localStorage)
```

### 2. Peticiones Autenticadas
```
React Component → GET /api/stations/public/nearby
                                    ↓
                        Axios Interceptor agrega:
                    Authorization: Bearer <tu_jwt_token>
                                    ↓
                            JwtFilter de Spring
                                    ↓
                    Valida token → SecurityContext
                                    ↓
                            Endpoint Logic
                                    ↓
                          Response JSON
```

---

## 📱 Prueba las Rutas

### Rutas Públicas (sin autenticación)

```bash
# Ver estaciones cerca de cierta ubicación
curl "http://localhost:8080/api/stations/public/nearby?lat=4.711&lng=-74.0721&radiusKm=5"

# Registrar usuario
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_doe",
    "email": "juan@example.com",
    "password": "MiPassword123",
    "phone": "+573012345678",
    "birthDate": "1990-05-15"
  }'
```

### Rutas Protegidas (requieren JWT)

```bash
# Obtener token (login)
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "MiPassword123"
  }' | jq -r '.token')

# Crear estación (requiere role OPERATOR o ADMIN)
curl -X POST http://localhost:8080/api/stations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Estación Central",
    "brand": "Terpel",
    "latitude": 4.711,
    "longitude": -74.0721,
    "address": "Calle 50 #10-50"
  }'

# Actualizar precio
curl -X PATCH "http://localhost:8080/api/stations/1/prices" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fuelType": "DIESEL",
    "priceCop": 12500.50
  }'
```

---

## 🧪 Usuarios de Prueba

Para testear diferentes roles, crea usuarios con estos comandos de registro:

### Usuario Normal
```json
{
  "username": "usuario",
  "email": "usuario@example.com",
  "password": "Password123"
}
```

### Operador (role: OPERATOR)
Después del registro, actualiza en MySQL:
```sql
UPDATE users SET role = 'OPERATOR' WHERE email = 'operador@example.com';
```

### Administrador (role: ADMIN)
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

---

## 🛠️ Estructura de Carpetas

```
DieselMaps/
├── backend/              (Spring Boot)
│   ├── src/main/java/com/dieselmaps/
│   │   ├── config/                    (Configuración de seguridad)
│   │   ├── controller/                (REST endpoints)
│   │   ├── dto/                       (Modelos de request/response)
│   │   ├── entity/                    (Entidades JPA)
│   │   ├── exception/                 (Manejo de errores)
│   │   ├── repository/                (Acceso a base de datos)
│   │   ├── security/                  (JWT y autenticación)
│   │   └── service/                   (Lógica de negocio)
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/             (React + Vite)
    ├── src/
    │   ├── api/                       (Llamadas Axios al backend)
    │   ├── components/                (Componentes reutilizables)
    │   ├── context/                   (Estado global - Auth)
    │   ├── pages/                     (Páginas principales)
    │   ├── hooks/                     (Hooks personalizados)
    │   ├── App.jsx                    (Router principal)
    │   └── main.jsx                   (Punto de entrada)
    ├── .env.local                     (Variables de entorno)
    ├── package.json
    └── vite.config.js
```

---

## 🐛 Troubleshooting

### El backend no se conecta a MySQL
```bash
# Verifica que MySQL esté corriendo
mysql -u root -p

# Verifica las credenciales en application.properties
# Asegúrate de que la base de datos exista
SHOW DATABASES;
USE diesel_maps;
```

### No carga el mapa en el frontend
```bash
# Verifica que el .env.local tenga la Google Maps API Key válida
# Asegúrate de que la API Key esté habilitada en Google Cloud

# En consola del navegador (F12), busca errores:
# "This API project is not authorized to use this API"
```

### Error 401 Unauthorized
```bash
# El token ha expirado (válido por 24 horas)
# Vuelve a hacer login para obtener un nuevo token
```

### CORS Error
```bash
# El frontend intenta conectar al backend pero falla
# Verifica que en Spring:
# - CORS está habilitado
# - app.cors.allowed-origins=http://localhost:3000 está en application.properties
```

---

## 📦 Build para Producción

### Backend
```bash
cd backend
mvn clean package
# JAR estará en: target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Archivos optimizados en: dist/
```

---

## 📚 Documentación Adicional

- [Spring Boot Security](https://spring.io/projects/spring-security)
- [JWT con JJWT](https://github.com/jwtk/jjwt)
- [React Router](https://reactrouter.com/)
- [Google Maps API](https://developers.google.com/maps)
- [Tailwind CSS](https://tailwindcss.com/)

---

¡Listo! 🎉 Tu aplicación DieselMaps está configurada y lista para usar.
