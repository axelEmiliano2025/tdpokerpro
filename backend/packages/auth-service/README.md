# @tdpokerpro/auth-service

Authentication & Authorization Service for TDPokerPro Platform.

## Características

- ✅ **Registro de usuarios** con validación de email y username
- ✅ **Login** con bcrypt password hashing
- ✅ **JWT Tokens** (access + refresh tokens)
- ✅ **Token Refresh** para renovar access tokens
- ✅ **Middleware de autenticación** para proteger rutas
- ✅ **Middleware de autorización** por roles (player, admin, director)
- ✅ **PostgreSQL** con Knex para gestión de usuarios

## Instalación

```bash
yarn install
```

## Configuración

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Variables importantes:
- `JWT_SECRET`: Secret para access tokens
- `JWT_EXPIRES_IN`: Duración del access token (formato: "1h", "2h", "24h")
- `JWT_REFRESH_SECRET`: Secret para refresh tokens
- `JWT_REFRESH_EXPIRES_IN`: Duración del refresh token (formato: "7d", "30d")
- `DB_*`: Configuración de PostgreSQL

## API Endpoints

### POST /auth/register
Registrar nuevo usuario

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "player",
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "1h"
    }
  }
}
```

### POST /auth/login
Login de usuario

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* ... */ },
    "tokens": { /* ... */ }
  }
}
```

### POST /auth/refresh
Renovar access token

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "1h"
    }
  }
}
```

### POST /auth/logout
Logout (cliente debe eliminar tokens)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /auth/me
Obtener información del usuario autenticado

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "player"
    }
  }
}
```

## Uso en otros servicios

```typescript
import {
  createAuthRouter,
  authenticateToken,
  authorizeRoles,
  UserRepository
} from '@tdpokerpro/auth-service';

// Montar rutas de autenticación
app.use('/auth', createAuthRouter(userRepository));

// Proteger rutas
app.get('/protected', authenticateToken, (req, res) => {
  console.log(req.user); // { userId, email, username, role }
  res.json({ message: 'Protected data' });
});

// Autorización por roles
app.post('/admin/action',
  authenticateToken,
  authorizeRoles('admin', 'director'),
  (req, res) => {
    // Solo admin o director pueden acceder
  }
);
```

## Estructura

```
src/
├── controllers/
│   └── AuthController.ts      # Controladores HTTP
├── services/
│   └── AuthService.ts          # Lógica de negocio
├── repositories/
│   └── UserRepository.ts       # Acceso a datos
├── middleware/
│   └── auth.ts                 # JWT middleware
├── routes/
│   └── auth.routes.ts          # Definición de rutas
└── index.ts                    # Exports públicos
```

## Seguridad

- ✅ Passwords hasheados con **bcrypt** (10 rounds)
- ✅ JWT con **secrets configurables**
- ✅ Tokens con **expiración**
- ✅ Refresh token rotation (opcional)
- ✅ Validación de inputs con **Joi**
- ⚠️ TODO: Rate limiting en endpoints de auth
- ⚠️ TODO: Email verification
- ⚠️ TODO: Password reset flow
- ⚠️ TODO: Token blacklist para logout

## Testing

```bash
# Tests unitarios (TODO)
yarn test

# Tests de integración (TODO)
yarn test:integration
```

## Próximos pasos

- [ ] Implementar email verification
- [ ] Implementar password reset
- [ ] Agregar rate limiting
- [ ] Token blacklist para logout real
- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth providers (Google, Facebook)
