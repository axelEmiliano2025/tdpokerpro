# GUÍA MAESTRA DE CONSTRUCCIÓN: TDPOKERPRO PLATFORM
## Instrucciones Completas para AI Agent en VS Code

---

## 📋 TABLA DE CONTENIDOS
1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Roles y Responsabilidades del AI Agent](#roles-y-responsabilidades-del-ai-agent)
3. [Principios Fundamentales](#principios-fundamentales)
4. [Fases de Construcción](#fases-de-construcción)
5. [Estructura de Carpetas y Archivos](#estructura-de-carpetas-y-archivos)
6. [Especificaciones Técnicas por Componente](#especificaciones-técnicas-por-componente)
7. [Rutas Críticas y Dependencias](#rutas-críticas-y-dependencias)
8. [Validación y Testing](#validación-y-testing)

---

## VISIÓN GENERAL DEL PROYECTO

### Nombre del Proyecto
**TDPokerPro Platform** - Plataforma integrada de gestión profesional de torneos de poker + red social temática + aplicación del jugador

### Objetivo Principal
Construir una plataforma completa empresarial que integre:
- **TDPokerPro Admin**: Gestión profesional de clubes, torneos y cash games
- **TDPokerPro Player**: Aplicación del jugador para participación en vivo
- **Red Social de Poker**: Comunidad de jugadores 100% temática
- Sistema de ranking y puntuación
- Notificaciones en tiempo real
- Dashboard de analytics completo
- Sistema de pagos integrado
- Gestión de bar/restaurante
- Control financiero exhaustivo

### Mercado Objetivo
Clubes de poker profesionales, organizadores de torneos, casinos, comunidad de jugadores en Brasil, Latinoamérica e internacionalmente.

### Stack Tecnológico Definido (NO SE MODIFICA)
- **Frontend**: Flutter 3.35+ (App móvil + Web via Flutter Web)
- **State Management**: Riverpod 3.0
- **Backend**: Node.js 20 + TypeScript
- **BD Principal**: PostgreSQL 16
- **Cache/RT**: Redis 7
- **Búsqueda**: Elasticsearch 8
- **Real-time**: Socket.io
- **Orquestación**: Docker + Kubernetes
- **Autenticación**: JWT + Refresh Tokens
- **Pagos**: Stripe / PagSeguro / Local integrations

---

## ROLES Y RESPONSABILIDADES DEL AI AGENT

### 1. ROLE: Full-Stack Architect
**Responsabilidades:**
- Mantener visión holística de TDPokerPro
- Garantizar integración correcta de gestión + jugador + social
- Validar dependencias entre capas
- Detectar conflictos arquitectónicos
- Documentar decisiones

**Comportamiento:**
- Verificar archivos base antes de crear nuevos
- Crear bases de otras capas primero si se necesitan
- NO crear archivos redundantes
- Revisar estructura actual antes de cada acción

### 2. ROLE: Backend Specialist (Node.js/TypeScript)
**Responsabilidades:**
- Diseñar e implementar microservicios
- Crear schemas de PostgreSQL
- Configurar Redis y Elasticsearch
- Implementar autenticación y autorización
- Diseñar APIs REST y WebSocket

**Comportamiento:**
- Seguir arquitectura Clean Architecture
- Usar TypeScript stricto
- Implementar error handling exhaustivo
- Crear tests unitarios para cada servicio

### 3. ROLE: Frontend Specialist (Flutter/Riverpod)
**Responsabilidades:**
- Construir UI/UX siguiendo estructura feature-first
- Implementar state management con Riverpod
- Conectar con APIs backend
- Optimizar performance y UX
- Implementar offline-first cuando sea posible

**Comportamiento:**
- Seguir Flutter best practices
- Usar freezed para modelos inmutables
- Crear custom widgets reutilizables
- Implementar tests de widgets e integración

### 4. ROLE: Database Architect
**Responsabilidades:**
- Diseñar schemas de PostgreSQL
- Configurar índices y optimizaciones
- Implementar Row Level Security (RLS)
- Diseñar estrategia de caché Redis
- Crear migraciones versionadas

**Comportamiento:**
- Pensar en escalabilidad desde el inicio
- Crear índices antes de poblar datos
- Documentar cada tabla y relación
- Implementar constraints y validaciones

### 5. ROLE: DevOps/Infrastructure
**Responsabilidades:**
- Crear Dockerfiles y docker-compose
- Configurar Kubernetes manifests
- Implementar CI/CD pipelines
- Monitoreo y logging
- Escalamiento automático

**Comportamiento:**
- Documentar cada paso de deploy
- Crear scripts de desarrollo local
- Implementar health checks
- Usar environment variables

### 6. ROLE: Quality Assurance
**Responsabilidades:**
- Validar cada componente antes de avanzar
- Crear test suites
- Detectar inconsistencias
- Verificar compliance con arquitectura
- Documentar bugs y limitaciones

**Comportamiento:**
- No permitir avance si hay tests fallando
- Verificar que cada archivo siga convenciones
- Validar integración entre capas
- Crear reportes de testing

---

## PRINCIPIOS FUNDAMENTALES

### 1. PRINCIPIO DE RESPONSABILIDAD ÚNICA
Cada archivo, función y clase tiene UNA responsabilidad clara.
- ❌ NO: Un archivo con autenticación, validación y caché
- ✅ SÍ: Un archivo por responsabilidad

### 2. PRINCIPIO DE ARQUITECTURA LIMPIA
Las capas son:
- **Presentación** (UI) → NO conoce lógica de negocio
- **Dominio** (Lógica) → NO conoce detalles de implementación
- **Datos** (Fuentes) → implementa los contracts del dominio
- **Infraestructura** (Servicios externos) → lowest level

### 3. PRINCIPIO DE IMMUTABILIDAD
Todos los modelos son inmutables:
- Usar `freezed` en Flutter
- Usar clases `readonly` en TypeScript
- NO mutar objetos, crear nuevas instancias

### 4. PRINCIPIO DE DEPENDENCY INJECTION
NO hay dependencias hardcodeadas:
- Inyectar servicios como parámetros
- Usar injection containers
- Facilita testing y reemplazo

### 5. PRINCIPIO DE SINGLE SOURCE OF TRUTH
Cada dato existe en UN único lugar:
- PostgreSQL = Source of Truth principal
- Redis = Cache de PostgreSQL (temporal)
- Elasticsearch = Index de PostgreSQL (lectura)

### 6. PRINCIPIO DE ZERO HALLUCINATION (CRÍTICO)
El AI Agent NUNCA:
- Crea carpetas/archivos fuera del plan
- Cambia la estructura definida
- Añade dependencias no listadas
- Modifica archivos sin explícitamente comunicar qué cambió
- Asume comportamientos o integraciones

Si algo no está claro, PREGUNTAR primero.

---

## FASES DE CONSTRUCCIÓN

### FASE 0: SCAFFOLDING (INFRAESTRUCTURA BASE)
**Duración:** 1-2 sesiones | **Objetivo:** Crear estructura base del proyecto

#### Paso 0.1: Inicializar repositorio raíz
Crear: `.gitignore`, `.editorconfig`, `README.md`, `docker-compose.dev.yml`
**Validación:** Git funcional, .gitignore trabajando

#### Paso 0.2: Estructura de directorio raíz
```
tdpokerpro/
├── backend/
├── frontend/
├── infrastructure/
├── docs/
└── scripts/
```
**Validación:** Carpetas creadas, documentadas

#### Paso 0.3: Inicializar backend monorepo
- `package.json` raíz
- `tsconfig.json` base
- `yarn workspaces` configurado
- `.eslintrc.json`, `.prettierrc.json`

**Validación:** `yarn install` exitoso

---

### FASE 1: DATABASE FOUNDATION
**Duración:** 2-3 sesiones | **Objetivo:** Establecer esquemas de BD

#### Paso 1.1: PostgreSQL Docker setup
- `docker-compose.dev.yml` con PostgreSQL 16
- Volumen persistente
- Script de inicialización
- Health checks

**Validación:** `docker-compose up postgres` funciona

#### Paso 1.2: Diseñar schemas PostgreSQL
Orden de creación:
1. Core tables: `users`, `user_profiles`, `user_rankings`
2. Game tables: `tournaments`, `tournament_participants`, `gaming_tables`, `blinds_structure`
3. Social tables: `posts`, `comments`, `social_interactions`
4. Business tables: `transactions`, `payments`, `game_statistics`

**Validación:** 25+ migraciones, índices, RLS policies

#### Paso 1.3: Implementar Row Level Security (RLS)
**Validación:** Tests de RLS exitosos

#### Paso 1.4: Crear migration system
- `node-pg-migrate` versionado
- Scripts up/down funcionales

**Validación:** Migraciones aplicables y reversibles

---

### FASE 2: BACKEND SCAFFOLDING
**Duración:** 2 sesiones | **Objetivo:** Infraestructura backend

#### Paso 2.1: Crear workspace api-gateway
```
backend/packages/api-gateway/
├── src/
├── dist/
├── tests/
├── package.json
└── tsconfig.json
```

#### Paso 2.2: Crear workspace shared-types
Centralizar tipos TypeScript compartidos

#### Paso 2.3: Implementar Express/Fastify base
- Configurar app principal
- Middleware de CORS, logging, error handling
- Routes structure

**Validación:** Servidor levanta en puerto 3000

#### Paso 2.4: Integrar PostgreSQL
- Pool de conexiones
- Connection pooling
- Tests de conexión

**Validación:** Conexión a BD exitosa

---

### FASES 3-8: MICROSERVICIOS BACKEND

#### FASE 3: AUTH SERVICE
- JWT generation/validation
- Refresh token rotation
- Password hashing
- Email verification

#### FASE 4: GAME ENGINE SERVICE
- Tournament engine
- Cash game engine
- Hand evaluator
- Table management
- Blind calculator
- Ranking calculator
- Wallet service

#### FASE 5: SOCIAL SERVICE
- Feed generator
- Post management
- Comment system
- User profiles
- Recommendations

#### FASE 6: PAYMENT SERVICE
- Stripe integration
- Webhook handling
- Reconciliation

#### FASE 7: NOTIFICATION SERVICE
- Push notifications
- Email notifications
- In-app notifications

#### FASE 8: WEBSOCKET & REAL-TIME
- Socket.io configuration
- /games namespace (TDPokerPro Admin + Player)
- /feed namespace (Social + Rankings)
- /notifications namespace (Todos)

---

### FASE 9-10: INFRASTRUCTURE & DEVOPS
#### FASE 9: Docker Containerization
#### FASE 10: GitHub Actions CI/CD

---

### FASES 11-16: FRONTEND FLUTTER

#### FASE 11: FLUTTER SCAFFOLDING
- Clean Architecture setup
- Riverpod configuration
- Supabase integration

#### FASE 12: AUTHENTICATION
- Login/Register
- Token management
- Secure storage

#### FASE 13: TDPokerPro ADMIN (Gestión)
- Tournament management
- Table management
- Player registration
- Financial dashboard
- Reports

#### FASE 14: TDPokerPro PLAYER (Aplicación del Jugador)
- Tournament list
- Live game view
- Actions interface
- Wallet management
- Rankings view

#### FASE 15: SOCIAL FEED
- Feed de posts
- Perfiles
- Seguimientos
- Leaderboard
- Search

#### FASE 16: NOTIFICATIONS & PAYMENTS

---

### FASES 17-19: FINALIZACIÓN

#### FASE 17: TESTING COMPLETO
80%+ coverage en componentes críticos

#### FASE 18: KUBERNETES DEPLOYMENT
Manifests, autoscaling, HPA

#### FASE 19: DOCUMENTATION & POLISH
API docs, architecture guide, setup guide

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS

### Backend - Estructura Exacta

```
backend/
├── package.json (root)
├── yarn.lock
├── tsconfig.json (base)
├── .eslintrc.json
├── .prettierrc.json
├── docker-compose.dev.yml
├── docker-compose.prod.yml
│
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── game-engine-service/
│   ├── social-service/
│   ├── payment-service/
│   ├── notification-service/
│   └── database/
│       ├── migrations/
│       ├── seeds/
│       ├── scripts/
│       └── schema.sql
│
└── infrastructure/
    ├── docker/
    ├── kubernetes/
    └── ci-cd/
```

### Frontend - Estructura Exacta

```
frontend/
├── pubspec.yaml
├── analysis_options.yaml
│
├── lib/
│   ├── main.dart
│   │
│   ├── config/
│   │   ├── routes/
│   │   ├── theme/
│   │   └── constants/
│   │
│   ├── core/
│   │   ├── errors/
│   │   ├── usecases/
│   │   ├── entities/
│   │   ├── injection/
│   │   └── utils/
│   │
│   ├── shared/
│   │   ├── data/
│   │   ├── presentation/
│   │   └── domain/
│   │
│   └── features/
│       ├── authentication/
│       ├── tdpokerpro_admin/      ← Gestión (Admin)
│       ├── tdpokerpro_player/     ← App del Jugador
│       ├── social_feed/
│       ├── notifications/
│       └── payments/
│
└── test/
    ├── unit/
    ├── integration/
    └── widget/
```

---

## COMUNICACIÓN DURANTE LA CONSTRUCCIÓN

El AI debe reportar:

**1. Inicio de tarea**
```
📋 [TAREA] Creando componente X
- Dependencias requeridas: Y, Z ✓
- Validaciones pre-build: ✓✓
```

**2. Progreso**
```
⏳ [PROGRESO] 40% completado
- Paso 1/3: ✅
- Paso 2/3: ⏳ (en proceso)
- Paso 3/3: ⏹️
```

**3. Validación**
```
✅ [VALIDACIÓN] Paso completado
- Archivos creados: 5
- Tests ejecutados: 12/12 ✓
- Coverage: 85%
```

**4. Errores**
```
❌ [ERROR] Algo falló
- Línea X del archivo Y
- Razón: Z
- Acción: Revirtiendo y pidiendo clarificación
```

**5. Siguiente paso**
```
➡️ [PRÓXIMO] Listo para FASE X
- Requisitos completados: ✓✓✓
- ¿Autorización para continuar?
```

---

## REGLAS ESTRICTAS QUE EL AI NUNCA DEBE VIOLAR

### Regla 1: Estructura de Carpetas
❌ NO crear carpetas/archivos fuera del plan
✅ SÍ preguntar primero si algo es necesario

### Regla 2: Stack Tecnológico
❌ NO cambiar tecnologías
✅ SÍ discutir alternativas dentro del mismo nivel

### Regla 3: Orden de Construcción
❌ NO saltar fases
✅ SÍ completar cada fase antes de avanzar

### Regla 4: Testing
❌ NO pasar a siguiente fase si tests fallan
✅ SÍ ejecutar tests antes de cada commit

### Regla 5: Documentación
❌ NO asumir que el código es autodocumentado
✅ SÍ comentar lógica compleja

### Regla 6: No Duplicación
❌ NO crear archivos redundantes
✅ SÍ reutilizar código existente

### Regla 7: Versionado
❌ NO hacer cambios sin commits descriptivos
✅ SÍ commit después de cada milestone validado

### Regla 8: Notificación de Cambios
❌ NO cambiar un archivo sin explícitamente comunicar qué cambió
✅ SÍ mostrar diffs y explicar modificaciones

---

## NOTAS FINALES

Este documento es exhaustivo pero vivo. Las decisiones arquitectónicas fundamentales NO cambian:

- **Stack**: Flutter + Node.js + PostgreSQL + Redis + Elasticsearch
- **Arquitectura**: Clean Architecture + Feature-First
- **Metodología**: Fase por fase, validación antes de avanzar
- **Objetivo**: TDPokerPro v1.0 - Plataforma enterprise-grade, escalable, mantenible

**¡Bienvenido a la construcción de TDPokerPro!** 🚀
