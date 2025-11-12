# @tdpokerpro/api-gateway

API Gateway principal para TDPokerPro Platform - Punto de entrada HTTP para todos los microservicios.

## Características

- ✅ **Express Server** con TypeScript
- ✅ **Middleware de Seguridad**: CORS, Helmet, Rate Limiting
- ✅ **Logging**: Winston integrado
- ✅ **Validación**: Joi schemas con middleware personalizado
- ✅ **Error Handling**: Manejo centralizado de errores
- ✅ **Database**: Pool de conexiones PostgreSQL con Knex
- ✅ **Health Check**: Endpoint `/api/v1/health`

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
- `PORT`: Puerto del servidor (default: 3000)
- `DB_*`: Configuración de PostgreSQL
- `JWT_SECRET`: Secret para tokens JWT
- `CORS_ORIGIN`: Orígenes permitidos para CORS

## Scripts

```bash
# Desarrollo (hot reload con tsx)
yarn dev

# Compilar TypeScript
yarn build

# Producción
yarn start

# Verificar tipos
yarn typecheck
```

## Estructura

```
src/
├── app.ts              # Configuración Express
├── server.ts           # Entrada del servidor
├── config/
│   ├── index.ts        # Configuración general
│   └── database.ts     # Pool PostgreSQL con Knex
├── middleware/
│   ├── errorHandler.ts # Manejo de errores
│   ├── requestLogger.ts # Logging de requests
│   └── validation.ts   # Validación con Joi
└── routes/
    └── index.ts        # Rutas principales
```

## Uso

### Iniciar servidor

```bash
yarn dev
```

El servidor estará disponible en `http://localhost:3000`

### Endpoints disponibles

#### Health Check
```http
GET /api/v1/health
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

#### API Info
```http
GET /api/v1/
```

## Próximos pasos (FASE 3+)

- [ ] Integrar auth-service para autenticación
- [ ] Agregar rutas para tournaments, games, social, payments
- [ ] Implementar WebSocket con Socket.io
- [ ] Agregar middleware de autenticación JWT
- [ ] Rate limiting por usuario/IP
