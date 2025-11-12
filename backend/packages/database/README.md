# Database Package

Gestión de base de datos PostgreSQL para TDPokerPro Platform.

## Estructura

```
database/
├── migrations/       # Migraciones versionadas
├── seeds/           # Datos de prueba
├── scripts/         # Scripts de utilidad
│   ├── init-db.sql      # Inicialización de PostgreSQL
│   ├── db-status.js     # Verificar estado de BD
│   └── seed.js          # Ejecutar seeds
└── package.json
```

## Comandos

### Migraciones

```bash
# Crear nueva migración
yarn migrate:create <nombre-de-la-migracion>

# Aplicar migraciones pendientes
yarn migrate:up

# Revertir última migración
yarn migrate:down

# Rehacer última migración
yarn migrate:redo

# Resetear base de datos completamente
yarn db:reset
```

### Utilidades

```bash
# Ver estado de la base de datos
yarn db:status

# Ejecutar seeds
yarn seed
```

## Variables de Entorno

Crear `.env` en la raíz del backend con:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tdpokerpro_dev
DB_USER=tdpokerpro_user
DB_PASSWORD=tdpokerpro_dev_password
```

O usar `DATABASE_URL`:

```env
DATABASE_URL=postgresql://tdpokerpro_user:tdpokerpro_dev_password@localhost:5432/tdpokerpro_dev
```

## Inicialización

1. Levantar PostgreSQL:
```bash
docker-compose -f ../../docker-compose.dev.yml up -d postgres
```

2. Verificar estado:
```bash
yarn db:status
```

3. Aplicar migraciones:
```bash
yarn migrate:up
```

4. (Opcional) Poblar con datos de prueba:
```bash
yarn seed
```
