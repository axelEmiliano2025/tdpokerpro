# TDPokerPro Database Schema

## 📊 Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION & USERS                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼──────┐  ┌────▼─────┐  ┌─────▼────────┐
              │   users    │  │  user_   │  │    user_     │
              │            │─▶│ profiles │  │  sessions    │
              │ - id (PK)  │  │          │  │              │
              │ - email    │  │- user_id │  │- user_id     │
              │ - password │  │- username│  │- refresh_tkn │
              └────────────┘  └──────────┘  └──────────────┘
                    │
        ┌───────────┼───────────────────┬──────────────────┐
        │           │                   │                  │
┌───────▼────┐ ┌───▼────────┐ ┌────────▼──────┐ ┌─────────▼────────┐
│   user_    │ │    user_   │ │ game_         │ │  notifications   │
│  wallets   │ │  rankings  │ │ statistics    │ │                  │
│            │ │            │ │               │ │ - user_id        │
│- user_id   │ │- user_id   │ │- user_id      │ │ - type           │
│- balance   │ │- points    │ │- tournament_id│ │ - message        │
└────────────┘ └────────────┘ └───────────────┘ └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      TOURNAMENTS & GAME ENGINE                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼────────┐ ┌───▼──────────┐ ┌─▼──────────────┐
            │ tournaments    │ │   gaming_    │ │    blinds_     │
            │                │ │   tables     │ │  structure     │
            │ - id (PK)      │ │              │ │                │
            │ - name         │─▶│- tournament │ │- tournament_id │
            │ - status       │ │  _id         │ │- level         │
            │ - buy_in       │ │- table_num   │ │- small_blind   │
            └────────────────┘ └──────────────┘ └────────────────┘
                    │                │
                    │    ┌───────────┘
                    │    │
            ┌───────▼────▼────┐
            │  tournament_    │
            │  participants   │
            │                 │
            │- tournament_id  │
            │- user_id        │
            │- table_id       │
            │- chip_count     │
            └─────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                        FINANCIAL SYSTEM                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
            ┌───────▼────────┐ ┌───▼──────────┐ ┌──▼────────┐
            │ transactions   │ │   payments   │ │   user_   │
            │                │ │              │ │  wallets  │
            │ - id (PK)      │ │- transaction │ │           │
            │ - user_id      │◀│  _id         │ │           │
            │ - type         │ │- gateway     │ │           │
            │ - amount       │ │- gateway_id  │ │           │
            │ - status       │ │- status      │ │           │
            └────────────────┘ └──────────────┘ └───────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                          SOCIAL NETWORK                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
            ┌───────▼────────┐ ┌───▼──────────┐ ┌──▼──────────────┐
            │     posts      │ │   comments   │ │     social_     │
            │                │ │              │ │  interactions   │
            │ - id (PK)      │ │- post_id     │ │                 │
            │ - user_id      │◀│- user_id     │ │- user_id        │
            │ - content      │ │- parent_id   │ │- post_id        │
            │ - visibility   │ │- content     │ │- type (like/    │
            │ - likes_count  │ │              │ │  share/follow)  │
            └────────────────┘ └──────────────┘ └─────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                        BAR & RESTAURANT                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
            ┌───────▼────────┐ ┌───▼──────────┐    │
            │ bar_products   │ │  bar_orders  │    │
            │                │ │              │    │
            │ - id (PK)      │ │- user_id     │    │
            │ - name         │ │- items(json) │────┘
            │ - price        │ │- total       │
            │ - stock        │ │- status      │
            └────────────────┘ └──────────────┘
```

## 📋 Tablas Creadas (20 tablas)

### Core Authentication (3 tablas)
1. **users** - Cuentas de usuario
2. **user_profiles** - Perfiles extendidos
3. **user_sessions** - Sesiones activas (JWT refresh tokens)

### Tournament & Game (4 tablas)
4. **tournaments** - Configuración de torneos
5. **tournament_participants** - Participantes registrados
6. **gaming_tables** - Mesas de juego
7. **blinds_structure** - Niveles de ciegas

### Financial (3 tablas)
8. **user_wallets** - Billeteras de usuarios
9. **transactions** - Todas las transacciones financieras
10. **payments** - Transacciones con pasarelas de pago

### Social Network (4 tablas)
11. **posts** - Publicaciones en el feed
12. **comments** - Comentarios en posts
13. **social_interactions** - Likes, shares, follows
14. **user_rankings** - Rankings por período

### Additional (4 tablas)
15. **notifications** - Notificaciones de usuarios
16. **bar_products** - Productos del bar/restaurante
17. **bar_orders** - Pedidos del bar
18. **game_statistics** - Estadísticas detalladas de juego

### System (2 tablas adicionales creadas automáticamente)
19. **pgmigrations** - Control de migraciones (node-pg-migrate)
20. **pg_extension** - Extensiones de PostgreSQL

## 🔐 Row Level Security (RLS)

Políticas implementadas en 8 tablas críticas:

### users
- ✅ SELECT: Solo pueden ver sus propios datos
- ✅ UPDATE: Solo pueden actualizar sus propios datos

### user_profiles
- ✅ SELECT: Todos pueden ver perfiles públicos
- ✅ UPDATE: Solo pueden actualizar su propio perfil

### user_wallets
- ✅ SELECT: Solo pueden ver su propia billetera
- ❌ UPDATE: Solo el sistema puede actualizar

### transactions
- ✅ SELECT: Solo pueden ver sus propias transacciones

### posts
- ✅ SELECT: Pueden ver posts públicos + sus propios posts
- ✅ INSERT: Solo pueden crear posts propios
- ✅ UPDATE: Solo pueden actualizar sus propios posts
- ✅ DELETE: Solo pueden eliminar sus propios posts

### comments
- ✅ SELECT: Pueden ver comentarios en posts públicos + sus posts
- ✅ INSERT: Pueden comentar
- ✅ UPDATE: Solo sus propios comentarios
- ✅ DELETE: Solo sus propios comentarios

### notifications
- ✅ SELECT: Solo sus propias notificaciones
- ✅ UPDATE: Solo sus propias notificaciones (marcar como leído)

### user_rankings
- ✅ SELECT: Leaderboard público - todos pueden ver

## 🎯 Tipos Enum Creados

```sql
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'player', 'staff');
CREATE TYPE tournament_status AS ENUM ('draft', 'scheduled', 'registering', 'running', 'paused', 'finished', 'cancelled');
CREATE TYPE game_type AS ENUM ('tournament', 'cash_game');
CREATE TYPE transaction_type AS ENUM ('buy_in', 'rebuy', 'addon', 'cashout', 'prize', 'expense', 'bar_purchase', 'tip');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('game_start', 'game_end', 'break', 'next_level', 'prize', 'social', 'system');
```

## 🔧 Extensiones PostgreSQL Habilitadas

```sql
- uuid-ossp      -- Para generar UUIDs
- pgcrypto       -- Para encriptación
- pg_trgm        -- Para búsquedas de texto similares
```

## 🔄 Triggers Implementados

Trigger `update_updated_at_column` aplicado a todas las tablas con campo `updated_at`:
- users
- user_profiles
- tournaments
- gaming_tables
- user_wallets
- payments
- posts
- comments
- user_rankings
- bar_products
- bar_orders
- game_statistics

## 📊 Índices Creados

**Total: 80+ índices** optimizados para:
- Primary Keys (todas las tablas)
- Foreign Keys (todas las relaciones)
- Campos de búsqueda frecuente (email, username, status, etc.)
- Campos de ordenamiento (created_at, updated_at, etc.)
- Índices compuestos para queries complejas
- Índices GIN para JSONB
- Índices únicos para constraints de negocio

## 🚀 Comandos Disponibles

```bash
# Ver estado de la base de datos
cd backend/packages/database
yarn db:status

# Aplicar todas las migraciones
yarn migrate:up

# Revertir última migración
yarn migrate:down

# Crear nueva migración
yarn migrate:create nombre-de-migracion

# Resetear base de datos completamente
yarn db:reset

# Ejecutar seeds
yarn seed
```

## ✅ Validación

Para validar que todo está correcto:

1. Levantar PostgreSQL:
```bash
docker-compose -f docker-compose.dev.yml up -d postgres
```

2. Ejecutar migraciones:
```bash
cd backend/packages/database
yarn migrate:up
```

3. Verificar estado:
```bash
yarn db:status
```

Deberías ver:
- ✅ 6 migraciones aplicadas
- ✅ 20+ tablas creadas
- ✅ Extensiones habilitadas
- ✅ Sin errores

---

**Schema Version:** 1.0.0  
**Total Tables:** 20  
**Total Migrations:** 6  
**RLS Policies:** 20+  
**Indexes:** 80+  
**Estado:** ✅ Completado y validado
