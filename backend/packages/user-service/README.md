# User Service

Servicio de gestión de usuarios para TDPokerPro. Maneja perfiles de usuario, wallets y estadísticas.

## 📋 Características

### User Profile Management
- **Perfiles de usuario**: Información personal, bio, país, avatar
- **Configuración de privacidad**: Control sobre visibilidad de perfil, stats y actividad
- **Actualización de datos**: Modificación de información personal

### Wallet Management
- **Gestión de fondos**: Depósitos y retiros
- **Balance tracking**: Seguimiento de saldo disponible
- **Validación de transacciones**: Verificación de fondos suficientes
- **Historial de transacciones**: Registro de operaciones (integración futura)

### Statistics Tracking
- **Estadísticas de torneos**: Torneos jugados, ganados, promedio de posición
- **Estadísticas de juegos**: Juegos totales, victorias
- **Estadísticas de manos**: Manos jugadas, manos ganadas
- **Métricas financieras**: Mayor ganancia, total de ganancias, total de buy-ins, ROI
- **Actualización automática**: Actualización después de cada torneo/juego

## 🏗️ Arquitectura

```
user-service/
├── src/
│   ├── repositories/
│   │   ├── UserProfileRepository.ts  # CRUD de perfiles
│   │   ├── UserWalletRepository.ts   # CRUD de wallets
│   │   └── UserStatsRepository.ts    # CRUD de estadísticas
│   ├── services/
│   │   └── UserService.ts            # Lógica de negocio
│   ├── controllers/
│   │   └── UserController.ts         # Handlers de HTTP
│   ├── routes/
│   │   └── user.routes.ts            # Definición de rutas
│   └── index.ts                      # Exports principales
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### User Profile

#### Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "player1",
      "email": "player1@example.com",
      "role": "player"
    },
    "profile": {
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Professional poker player",
      "country": "US",
      "avatarUrl": "https://...",
      "privacySettings": {
        "showProfile": true,
        "showStats": true,
        "showActivity": false
      }
    }
  }
}
```

#### Update Profile
```http
PATCH /api/v1/users/:id/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Pro player",
  "country": "US",
  "privacySettings": {
    "showProfile": true,
    "showStats": true,
    "showActivity": false
  }
}
```

#### Update Avatar
```http
PATCH /api/v1/users/:id/avatar
Authorization: Bearer <token>
Content-Type: application/json

{
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Wallet Management

#### Get Wallet
```http
GET /api/v1/users/:id/wallet
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "balance": 1500.50,
    "currency": "USD",
    "lastTransaction": "2024-01-15T10:30:00Z"
  }
}
```

#### Deposit Funds
```http
POST /api/v1/users/:id/wallet/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100.00,
  "description": "Initial deposit"
}
```

#### Withdraw Funds
```http
POST /api/v1/users/:id/wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Withdrawal to bank"
}
```

### Statistics

#### Get User Statistics
```http
GET /api/v1/users/:id/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "totalTournaments": 150,
    "tournamentsWon": 12,
    "totalGames": 1200,
    "gamesWon": 480,
    "totalHands": 25000,
    "handsWon": 9500,
    "biggestWin": 5000.00,
    "totalWinnings": 45000.00,
    "totalBuyIns": 30000.00,
    "roi": 50.00,
    "avgFinishPosition": 3.5
  }
}
```

## 🔐 Permisos

### Acceso a Datos de Usuario
- **Propio perfil/wallet**: Usuario autenticado puede acceder a sus propios datos
- **Administradores**: Acceso completo a todos los usuarios
- **Estadísticas públicas**: Acceso según configuración de privacidad del usuario

### Validaciones
- User ID requerido en todas las rutas con parámetro `:id`
- Token JWT válido para operaciones protegidas
- Validación de esquemas Joi para requests

## 🗄️ Modelos de Datos

### UserProfile
```typescript
interface UserProfile {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  country: string | null;
  avatarUrl: string | null;
  privacySettings: {
    showProfile: boolean;
    showStats: boolean;
    showActivity: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### UserWallet
```typescript
interface UserWallet {
  userId: string;
  balance: number;
  currency: string;
  lastTransaction: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserStats
```typescript
interface UserStats {
  userId: string;
  totalTournaments: number;
  tournamentsWon: number;
  totalGames: number;
  gamesWon: number;
  totalHands: number;
  handsWon: number;
  biggestWin: number;
  totalWinnings: number;
  totalBuyIns: number;
  roi: number;
  avgFinishPosition: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuración

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

### Variables de Entorno

- `NODE_ENV`: Entorno de ejecución
- `PORT`: Puerto del servicio (3002)
- `DB_*`: Configuración de PostgreSQL
- `MIN_WITHDRAWAL_AMOUNT`: Monto mínimo de retiro
- `MAX_WITHDRAWAL_AMOUNT`: Monto máximo de retiro
- `WITHDRAWAL_FEE_PERCENTAGE`: Porcentaje de comisión por retiro
- `DEFAULT_*`: Configuración por defecto de privacidad

## 🚀 Uso

### Integración en API Gateway

```typescript
import { createUserRouter } from '@tdpokerpro/user-service';

const userRouter = createUserRouter(db);
app.use('/api/v1/users', userRouter);
```

### Uso Directo del Servicio

```typescript
import { UserService } from '@tdpokerpro/user-service';

const userService = new UserService(
  userRepository,
  profileRepository,
  walletRepository,
  statsRepository
);

// Obtener usuario
const userData = await userService.getUserById('user-id');

// Actualizar perfil
const profile = await userService.updateProfile('user-id', {
  firstName: 'John',
  bio: 'Pro player'
});

// Depósito
await userService.depositFunds('user-id', 100);

// Retiro
await userService.withdrawFunds('user-id', 50);

// Estadísticas
const stats = await userService.getUserStats('user-id');
```

## 🧪 Testing

```bash
# Compilar
yarn build

# Tests (pendiente)
yarn test

# Linting
yarn lint
```

## 📦 Dependencias

- **express**: Framework web
- **knex**: Query builder SQL
- **pg**: Driver PostgreSQL
- **joi**: Validación de esquemas
- **@tdpokerpro/shared-types**: Tipos compartidos
- **@tdpokerpro/auth-service**: Autenticación y autorización

## 🔄 Integración con Otros Servicios

### Auth Service
- Utiliza `UserRepository` de auth-service
- Aplica middleware `authenticateToken` y `authorizeRoles`
- Valida permisos de acceso

### Tournament Service (futuro)
- Actualiza estadísticas después de torneos
- Modifica balance después de premios

### Game Service (futuro)
- Actualiza estadísticas después de juegos
- Registra hands ganadas/perdidas

## 🛠️ Mantenimiento

### Actualización de Estadísticas
Las estadísticas se actualizan automáticamente mediante:
- `updateAfterTournament()`: Después de cada torneo
- `updateAfterGame()`: Después de cada juego

### ROI Calculation
```typescript
ROI = ((totalWinnings - totalBuyIns) / totalBuyIns) * 100
```

### Average Finish Position
Calculado automáticamente basado en historial de posiciones en torneos.

## 📝 Notas

- Todas las operaciones de wallet requieren autenticación
- Las estadísticas pueden ser públicas según configuración de privacidad
- Los retiros tienen comisión configurable
- Montos mínimos y máximos de retiro configurables
- Perfiles creados automáticamente al registrar usuario (trigger en base de datos)

## 🔜 Próximas Mejoras

- [ ] Historial de transacciones de wallet
- [ ] Sistema de notificaciones para operaciones de wallet
- [ ] Exportación de estadísticas
- [ ] Gráficas de rendimiento
- [ ] Comparación con otros jugadores
- [ ] Badges y logros
