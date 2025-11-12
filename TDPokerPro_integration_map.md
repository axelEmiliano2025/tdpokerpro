# MAPEO DE INTEGRACIÓN: TDPokerPro Admin + TDPokerPro Player + Red Social
## Cómo se Integran las 3 Funcionalidades en la Misma Plataforma

---

## VISIÓN INTEGRADA

```
┌─────────────────────────────────────────────────────────────────┐
│               TDPokerPro PLATFORM v1.0                          │
│  TDPokerPro Admin + TDPokerPro Player + Red Social (Integrados) │
└─────────────────────────────────────────────────────────────────┘

                          USUARIOS
                             │
                ┌────────────┼────────────┐
                │            │            │
          [ADMIN]        [JUGADOR]   [COMUNIDAD]
                │            │            │
         ┌──────▼──────┐ ┌──▼─────────┐ ┌──▼──────────┐
         │   TDPokerPro│ │TDPokerPro  │ │ Red Social  │
         │    ADMIN    │ │  PLAYER    │ │    App      │
         │  Dashboard  │ │    App     │ │ (Conectar)  │
         │ (Gestión)   │ │  (Jugar)   │ │             │
         └──────┬──────┘ └──┬─────────┘ └──┬──────────┘
                │           │             │
                └───────────┼─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐         ┌────▼────┐        ┌────▼────┐
    │ Web/Tab│         │ Flutter │        │ WebSite │
    │ Admin  │         │   App   │        │ Admin   │
    │        │         │ iOS/And │        │         │
    └────────┘         └─────────┘        └─────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
            ┌───▼─────────────────┐ ┌──▼─────────┐
            │   REST APIs         │ │ WebSocket  │
            │   Express.js        │ │ Socket.io  │
            │   (Puerto 3000)     │ │ (Real-time)│
            └─────┬───────────────┘ └────────────┘
                  │
    ┌─────────────┼─────────────────────────────┐
    │             │                             │
┌───▼──────┐ ┌──▼────────┐ ┌─────────┐ ┌──────▼──┐
│   Auth   │ │ Game-Eng  │ │ Social  │ │Payment │
│ Service  │ │ Service   │ │Service  │ │Service │
└────┬─────┘ └──┬───────┘ └────┬────┘ └───┬────┘
     │          │              │          │
     └──────────┼──────────────┼──────────┘
                │              │
        ┌───────┴──────┬───────┴────────┐
        │              │                │
    ┌───▼────┐   ┌────▼────┐    ┌─────▼──┐
    │PostgreSQL 16     │ Redis 7  │ Elastic 8│
    │(BD Principal)   │(Cache)   │(Search) │
    └──────────────────┴──────────┴─────────┘
```

---

## TDPokerPro ADMIN: Gestión del Club

```
ADMINISTRADOR DEL CLUB
    │
    └─→ Accede a: Dashboard (Web o Mobile Admin)
        │
        ├─→ [CREAR TORNEO]
        │   ├─ Nombre, buy-in, estructura de blinds
        │   └─→ Guardado en: tournaments table
        │
        ├─→ [REGISTRAR JUGADORES]
        │   ├─ Agregar participantes manualmente o masivo
        │   └─→ Guardado en: tournament_participants table
        │
        ├─→ [INICIAR TORNEO]
        │   ├─ Asignar mesas automáticamente
        │   ├─ Enviar notificación a jugadores (WebSocket)
        │   └─→ Estado: STARTED
        │
        ├─→ [GESTIONAR MESAS EN VIVO]
        │   ├─ Ver estado actual de cada mesa
        │   ├─ Avance de ciegos (automático o manual)
        │   ├─ Control de jugadores
        │   └─→ Real-time via WebSocket /games
        │
        ├─→ [CONTROL DE CAJA]
        │   ├─ Venta de fichas
        │   ├─ Compras en bar/restaurante
        │   ├─ Gorjetas y comisiones
        │   └─→ Guardado en: transactions table
        │
        └─→ [REPORTES ANALÍTICOS]
            ├─ Ingresos vs gastos
            ├─ Top jugadores por puntos
            ├─ Estadísticas de torneos
            └─→ Consultado desde: game_statistics table


FLUJO BACKEND DE TDPOKERPRO ADMIN:
        
Admin Request
    ↓
[API GATEWAY] → Valida JWT (role: ADMIN)
    ↓
[GAME-ENGINE-SERVICE]
    ├─ tournament.engine.ts
    ├─ table.manager.ts
    ├─ blind.calculator.ts
    └─ wallet.service.ts
    ↓
[PostgreSQL]
    └─ tournaments, gaming_tables, transactions
    ↓
[Redis] ← Caché de estado en vivo
    ↓
[WEBSOCKET /games]
    └─ Broadcast de cambios a todos los conectados
```

---

## TDPokerPro PLAYER: App del Jugador

```
JUGADOR
  │
  └─→ Accede a: App Flutter (iOS/Android)
      │
      ├─→ [LOGIN]
      │   ├─ Email + Contraseña
      │   └─→ Recibe JWT token
      │
      ├─→ [VER TORNEOS DISPONIBLES]
      │   ├─ Lista de torneos (filtrable)
      │   ├─ Info: Blinds, jugadores, premios
      │   └─→ Consultado desde: tournaments table
      │
      ├─→ [REGISTRARSE EN TORNEO]
      │   ├─ Click: "Register"
      │   ├─ Pago de buy-in (via Payment-Service)
      │   └─→ Creado: registro en tournament_participants
      │
      ├─→ [VER MIS TORNEOS]
      │   ├─ Mis inscripciones activas
      │   ├─ Mis inscripciones pasadas
      │   └─→ Consultado: tournament_participants (user_id = mío)
      │
      ├─→ [TORNEO EN VIVO - Esperar Asignación]
      │   ├─ Conectarse a WebSocket /games
      │   ├─ Esperar mesa asignada
      │   └─→ Event: "table-assigned" vía WebSocket
      │
      ├─→ [EN MESA - VER JUEGO]
      │   ├─ Información en vivo:
      │   │  - Blinds actuales
      │   │  - Tiempo en nivel
      │   │  - Jugadores restantes
      │   │  - Mi stack
      │   │  - Posición en mesa
      │   ├─ Comunidad en vivo (5 cartas)
      │   ├─ Mi mano privada
      │   └─→ Real-time desde: Redis + WebSocket
      │
      ├─→ [REALIZAR ACCIONES]
      │   ├─ CALL / RAISE / FOLD / CHECK / ALL-IN
      │   ├─ Enviar acción al backend
      │   └─→ Guardado en: game_history table
      │       Broadcast a: todas las mesas (WebSocket)
      │
      ├─→ [VER MI SALDO/WALLET]
      │   ├─ Dinero disponible para buy-ins
      │   ├─ Historial de transacciones
      │   └─→ Consultado desde: user_wallets table
      │
      └─→ [VER RANKING]
          ├─ Mi posición en ranking global
          ├─ Mis puntos acumulados
          ├─ Top 10 jugadores
          └─→ Consultado desde: user_rankings table
              (cached en Redis sorted sets)


FLUJO BACKEND DE TDPOKERPRO PLAYER:

Jugador Request
    ↓
[API GATEWAY] → Valida JWT (role: PLAYER)
    ↓
[GAME-ENGINE-SERVICE]
    ├─ tournament.controller.ts (GET, POST register)
    ├─ table.controller.ts (GET table state)
    ├─ wallet.service.ts (GET balance)
    └─ ranking.calculator.ts (GET rankings)
    ↓
[PostgreSQL]
    ├─ tournaments, tournament_participants
    ├─ gaming_tables, game_history
    ├─ user_wallets, user_rankings
    └─ transactions
    ↓
[Redis]
    ├─ Table state (real-time)
    └─ Leaderboard (sorted sets)
    ↓
[WEBSOCKET /games]
    └─ Real-time updates:
        - Blinds advancement
        - Player actions
        - Table assignments
        - Hand evaluations
```

---

## RED SOCIAL: Comunidad de Poker

```
JUGADOR - Sección Social
  │
  └─→ Accede a: Sección SOCIAL dentro de app Flutter
      │
      ├─→ [VER FEED DE COMUNIDAD]
      │   ├─ Posts sobre:
      │   │  - Manos interesantes
      │   │  - Bad beats
      │   │  - Tips de juego
      │   │  - Chismes de torneos
      │   ├─ Ordenado por: relevancia (algoritmo ML)
      │   └─→ Consultado desde: posts table
      │       Cached en: Redis (feed cache)
      │
      ├─→ [CREAR POST]
      │   ├─ Texto + opcionalmente fotos
      │   ├─ Incluir hashtags
      │   ├─ Publicar
      │   └─→ Guardado en: posts table
      │       Broadcast: WebSocket /feed (todos mis seguidores)
      │
      ├─→ [INTERACTUAR CON POSTS]
      │   ├─ LIKE (❤️)
      │   ├─ COMENTAR
      │   └─ SHARE
      │
      ├─→ [VER PERFIL DE OTRO JUGADOR]
      │   ├─ Avatar + Username
      │   ├─ Bio corta
      │   ├─ Estadísticas y rankings
      │   ├─ Posts recientes
      │   ├─ Botón: SEGUIR / DEJAR DE SEGUIR
      │   └─→ Consultado desde: users, user_profiles
      │
      ├─→ [SEGUIR/DEJAR DE SEGUIR JUGADOR]
      │   ├─ Click: "Follow" button
      │   └─→ Guardado en: social_interactions (type: FOLLOW)
      │
      ├─→ [VER RANKING PÚBLICO]
      │   ├─ Top 100 jugadores
      │   ├─ Ordenado por: puntos
      │   └─→ Consultado desde: user_rankings table
      │
      └─→ [NOTIFICACIONES SOCIALES]
          ├─ "X liked your post"
          ├─ "X started following you"
          └─→ Guardado en: notifications table
              Delivered: WebSocket /notifications


FLUJO BACKEND DE RED SOCIAL:

Jugador Request
    ↓
[API GATEWAY]
    ↓
[SOCIAL-SERVICE]
    ├─ post.controller.ts (POST create, GET list)
    ├─ comment.controller.ts (POST comment)
    ├─ social_interactions.controller.ts (POST like, follow)
    ├─ user_profile.controller.ts (GET profile)
    └─ feed.generator.ts (Feed ranking algorithm)
    ↓
[PostgreSQL]
    ├─ posts, comments, social_interactions
    ├─ users, user_profiles
    └─ user_rankings
    ↓
[Redis]
    ├─ Feed cache (30 min TTL)
    ├─ Leaderboard (sorted sets)
    └─ User suggestions (cache)
    ↓
[WEBSOCKET /feed]
    ├─ New post published
    ├─ Post liked
    ├─ Comment added
    └─ User followed
```

---

## CONCLUSIÓN

**TDPokerPro Platform integra 3 funcionalidades en 1 solo proyecto:**

✅ **TDPokerPro Admin** - Gestión profesional del club (Admin dashboard)
✅ **TDPokerPro Player** - App de participación del jugador (Móvil/Web)
✅ **Red Social** - Comunidad de jugadores temática (Sección en app)

Todas comparten:
- ✅ Una sola base de datos (single source of truth)
- ✅ Un solo backend (reutilizable para todos)
- ✅ Una sola app Flutter (diferentes secciones por rol)
- ✅ WebSocket real-time (múltiples namespaces)
- ✅ Sistema de autenticación único (JWT)

**Resultado:** Plataforma empresarial, escalable, integrada. Listo para producción.
