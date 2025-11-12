# Backend - TDPokerPro Platform

Node.js + TypeScript monorepo para servicios backend.

## Estructura

```
backend/
├── packages/
│   ├── api-gateway/         # API Gateway principal (Express/Fastify + Socket.io)
│   ├── auth-service/        # Servicio de autenticación JWT
│   ├── game-engine-service/ # Motor de torneos y cash games
│   ├── social-service/      # Servicio de red social
│   ├── payment-service/     # Integración de pagos (Stripe)
│   ├── notification-service/# Notificaciones push y email
│   ├── shared-types/        # Tipos TypeScript compartidos
│   ├── shared-utils/        # Utilidades compartidas
│   └── database/            # Migraciones, schemas y seeds
└── infrastructure/          # Configuración de Docker, K8s
```

## Stack Tecnológico

- **Runtime**: Node.js 20.x
- **Lenguaje**: TypeScript 5.x
- **Framework**: Express.js / Fastify
- **Base de Datos**: PostgreSQL 16
- **Cache**: Redis 7
- **Búsqueda**: Elasticsearch 8
- **Real-time**: Socket.io
- **ORM**: Knex.js
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Comandos

```bash
# Instalar dependencias
yarn install

# Desarrollo
yarn dev

# Build
yarn build

# Tests
yarn test
yarn test:coverage

# Linting
yarn lint
yarn lint:fix
```

## Arquitectura

Microservicios independientes comunicados a través de API Gateway.
Cada servicio mantiene Clean Architecture con capas bien definidas.
