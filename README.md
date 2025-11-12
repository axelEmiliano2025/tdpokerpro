# 🎰 TDPokerPro Platform

**Plataforma integrada profesional de gestión de torneos de poker + red social temática + aplicación del jugador**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.35+-blue.svg)](https://flutter.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## 📋 Descripción

TDPokerPro Platform es una solución enterprise-grade que integra tres componentes principales:

- **🎯 TDPokerPro Admin** - Dashboard de gestión profesional para clubes de poker
- **📱 TDPokerPro Player** - Aplicación móvil/web para jugadores
- **👥 Red Social de Poker** - Comunidad temática de poker con feed, rankings y perfiles

### Características Principales

✅ **88 Funcionalidades Integradas**
- Gestión completa de torneos y cash games
- Control financiero exhaustivo
- Sistema de ranking y puntuación
- Bar/Restaurante integrado
- Pagos con Stripe/PagSeguro
- Notificaciones real-time
- Red social temática
- Analytics y reportes profesionales

✅ **Stack Tecnológico Moderno**
- Frontend: Flutter + Riverpod
- Backend: Node.js + TypeScript
- Base de Datos: PostgreSQL + Redis + Elasticsearch
- Real-time: WebSocket (Socket.io)
- Infraestructura: Docker + Kubernetes

---

## 🚀 Quick Start

### Prerequisitos

- **Node.js** 20.x o superior
- **Yarn** 1.22.x o superior
- **Flutter** 3.35 o superior
- **Docker** 20.x o superior
- **Docker Compose** 2.x o superior
- **PostgreSQL** 16 (via Docker)
- **Git** 2.x

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/your-org/tdpokerpro.git
cd tdpokerpro

# Instalar dependencias del backend
cd backend
yarn install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Levantar servicios de infraestructura (PostgreSQL, Redis, Elasticsearch)
docker-compose -f docker-compose.dev.yml up -d

# Ejecutar migraciones de base de datos
yarn migrate:up

# Iniciar backend en modo desarrollo
yarn dev

# En otra terminal, iniciar frontend
cd ../frontend
flutter pub get
flutter run -d chrome  # Para web
# o
flutter run -d <device>  # Para móvil
```

---

## 📁 Estructura del Proyecto

```
tdpokerpro/
├── backend/                  # Node.js + TypeScript monorepo
│   ├── packages/
│   │   ├── api-gateway/      # API Gateway principal
│   │   ├── auth-service/     # Servicio de autenticación
│   │   ├── game-engine-service/  # Motor de juegos
│   │   ├── social-service/   # Servicio de red social
│   │   ├── payment-service/  # Servicio de pagos
│   │   ├── notification-service/  # Notificaciones
│   │   ├── shared-types/     # Tipos compartidos
│   │   ├── shared-utils/     # Utilidades compartidas
│   │   └── database/         # Migraciones y schemas
│   └── infrastructure/
│
├── frontend/                 # Flutter app
│   ├── lib/
│   │   ├── config/           # Configuración, rutas, tema
│   │   ├── core/             # Core utilities
│   │   ├── shared/           # Widgets y utilidades compartidas
│   │   └── features/         # Features principales
│   │       ├── authentication/
│   │       ├── tdpokerpro_admin/    # Gestión de clubes
│   │       ├── tdpokerpro_player/   # App del jugador
│   │       ├── social_feed/         # Red social
│   │       ├── notifications/
│   │       └── payments/
│   └── test/
│
├── infrastructure/           # Docker, Kubernetes, CI/CD
│   ├── docker/
│   ├── kubernetes/
│   └── ci-cd/
│
├── docs/                     # Documentación técnica
│   ├── architecture/
│   ├── api/
│   └── guides/
│
└── scripts/                  # Scripts de utilidad
    ├── setup.sh
    ├── deploy.sh
    └── backup.sh
```

---

## 🛠️ Comandos Disponibles

### Backend

```bash
# Desarrollo
yarn dev                 # Iniciar en modo desarrollo
yarn build               # Compilar TypeScript
yarn start               # Iniciar en producción

# Testing
yarn test                # Ejecutar tests unitarios
yarn test:coverage       # Tests con coverage
yarn test:integration    # Tests de integración

# Database
yarn migrate:up          # Ejecutar migraciones
yarn migrate:down        # Revertir última migración
yarn seed                # Poblar BD con datos de prueba

# Linting
yarn lint                # Ejecutar ESLint
yarn lint:fix            # Fix automático de ESLint
yarn format              # Formatear con Prettier
```

### Frontend

```bash
# Desarrollo
flutter run              # Ejecutar app
flutter run -d chrome    # Ejecutar en web

# Testing
flutter test             # Ejecutar tests
flutter test --coverage  # Tests con coverage

# Build
flutter build apk        # Build Android APK
flutter build ios        # Build iOS
flutter build web        # Build Web

# Análisis
flutter analyze          # Análisis estático
```

### Docker

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up -d      # Levantar servicios
docker-compose -f docker-compose.dev.yml down       # Detener servicios
docker-compose -f docker-compose.dev.yml logs -f    # Ver logs

# Producción
docker-compose -f docker-compose.prod.yml up -d     # Levantar en producción
```

---

## 🧪 Testing

### Coverage Targets
- **Backend**: 80%+ de cobertura en servicios críticos
- **Frontend**: 70%+ de cobertura en lógica de negocio

### Estrategia de Testing
- **Unit Tests**: Funciones, métodos, utilidades
- **Integration Tests**: Flujos completos entre servicios
- **Widget Tests**: Componentes Flutter
- **E2E Tests**: Flujos críticos de usuario

---

## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta `/docs`:

- **[Construction Guide](./TDPokerPro_construction_guide.md)** - Guía maestra de construcción
- **[System Prompt](./TDPokerPro_system_prompt.md)** - Prompt para AI Agent
- **[Integration Map](./TDPokerPro_integration_map.md)** - Mapeo de integraciones
- **[Checklist](./TDPokerPro_checklist.md)** - Checklist visual de progreso
- **[Features Complete](./TDPokerPro_features_complete.md)** - 88 funcionalidades mapeadas

---

## 🏗️ Fases de Construcción

El proyecto se construye en **19 fases secuenciales**:

- **FASE 0**: Scaffolding (✅ En progreso)
- **FASE 1**: Database Foundation
- **FASE 2**: Backend Scaffolding
- **FASE 3-8**: Microservicios Backend
- **FASE 9-10**: Infrastructure & DevOps
- **FASE 11-16**: Frontend Flutter
- **FASE 17-19**: Testing, Deployment & Documentation

Ver [TDPokerPro_checklist.md](./TDPokerPro_checklist.md) para progreso detallado.

---

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Consulta la guía de construcción
2. Sigue las convenciones de código
3. Ejecuta tests antes de commit
4. Documenta cambios significativos

---

## 📄 Licencia

Propietario - Todos los derechos reservados

---

## 📞 Contacto

Para preguntas o soporte:
- **Email**: support@tdpokerpro.com
- **Documentación**: `/docs`

---

**Construido con ❤️ para la comunidad de poker profesional**
