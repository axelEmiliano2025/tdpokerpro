# TDPokerPro - Migration Scripts

Scripts para migración de datos de Knex a TypeORM (PHASE 7a PASO 1-3).

## ⚠️ PRECAUCIÓN CRÍTICA

**NUNCA ejecutar en producción sin backup completo**

## Scripts disponibles

### 1. `backup-database.sh`
Crea backup comprimido de la base de datos.

```bash
# Uso
chmod +x scripts/backup-database.sh
./scripts/backup-database.sh

# Con variables de entorno
DB_HOST=staging-db.example.com \
DB_USER=app_user \
DB_PASSWORD=secret \
./scripts/backup-database.sh
```

**Output:** `backups/tdpokerpro_backup_YYYYMMDD_HHMMSS.sql.gz`

### 2. `migrate-data-to-typeorm.ts`
Migra datos de tablas Knex legacy a entidades TypeORM.

```bash
# ANTES de ejecutar: BACKUP!
./scripts/backup-database.sh

# Compilar TypeScript
yarn build

# Ejecutar migración
npx ts-node scripts/migrate-data-to-typeorm.ts
```

**Qué migra:**
- ✅ Users (users → users)
- ⚠️ Tournaments (requiere TournamentRepository TypeORM)
- ✅ Blind Schedules (tournament_blind_schedules → blind_schedules)
- ✅ Player Entries (player_entries → player_entries)
- ✅ Penalties (penalties → penalties)

### 3. `validate-migration.ts`
Valida integridad de datos después de migración.

```bash
npx ts-node scripts/validate-migration.ts
```

**Validaciones:**
- ✅ Conteo de entidades
- ✅ Foreign keys intactas
- ✅ Tipos de datos correctos
- ✅ Queries de repositorios funcionando

### 4. `test-repositories.ts`
Prueba repositorios TypeORM con queries reales.

```bash
npx ts-node scripts/test-repositories.ts
```

**Pruebas:**
- findAll(), findById(), count()
- findByUsername(), findByEmail()
- Relaciones (player, tournament)

### 5. `rollback-migration.sh`
Restaura base de datos desde último backup.

```bash
chmod +x scripts/rollback-migration.sh
./scripts/rollback-migration.sh
```

**⚠️ DESTRUYE la base de datos actual**

## Workflow completo

### Escenario 1: Nueva instalación (sin datos legacy)

```bash
# 1. Solo validar que TypeORM funciona
npx ts-node scripts/test-repositories.ts

# 2. Validar estructura
npx ts-node scripts/validate-migration.ts
```

### Escenario 2: Migración de datos legacy

```bash
# 1. BACKUP obligatorio
./scripts/backup-database.sh

# 2. Verificar backup creado
ls -lh backups/

# 3. Compilar
yarn build

# 4. Ejecutar migración
NODE_ENV=staging npx ts-node scripts/migrate-data-to-typeorm.ts

# 5. Validar migración
npx ts-node scripts/validate-migration.ts

# 6. Probar repositorios
npx ts-node scripts/test-repositories.ts

# Si falla: ROLLBACK
# ./scripts/rollback-migration.sh
```

## Variables de entorno

```bash
DB_HOST=localhost       # Database host
DB_PORT=5432           # PostgreSQL port
DB_USER=postgres       # Database user
DB_PASSWORD=postgres   # Database password
DB_NAME=tdpokerpro     # Database name
NODE_ENV=development   # Environment (staging/production)
```

## Protecciones de seguridad

### migrate-data-to-typeorm.ts
```typescript
// FATAL ERROR si NODE_ENV=production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: Cannot run migration in production!');
  process.exit(1);
}
```

### Manejo de errores
- ✅ Tablas legacy no encontradas → SKIP (no fatal)
- ✅ Errores de migración individual → LOG + continue
- ✅ Errores fatales → ABORT + exit code 1

## Troubleshooting

### "Table does not exist"
```
ℹ️ Legacy table not found - skipping
```
**Solución:** Normal para instalaciones nuevas. Los scripts son idempotentes.

### "Migration completed with errors"
```
⚠️ Warning: Some errors occurred during migration
Review logs above for details
```
**Solución:** Revisar logs, identificar registros problemáticos, decidir:
- Re-ejecutar migración con correcciones
- Rollback y fix data en origen
- Continuar (si errores son aceptables)

### "Foreign key constraint violation"
```
❌ Error migrating: foreign key constraint "fk_..." violated
```
**Solución:** Migrar en orden correcto:
1. Users
2. Tournaments
3. Blind Schedules
4. Player Entries
5. Penalties

## Checklist pre-migración

```
☐ Backup creado y verificado
☐ NODE_ENV != production
☐ Team disponible para rollback
☐ Tablas TypeORM creadas (migrations 001-005)
☐ Repositorios compilados sin errores
☐ Conexión DB verificada
☐ Espacio en disco suficiente
```

## Output esperado

### backup-database.sh
```
🔄 Starting database backup...
   Database: tdpokerpro
   Host: localhost
   Timestamp: 20241113_143022
✅ Backup completed: backups/tdpokerpro_backup_20241113_143022.sql.gz
   Size: 2.3M
```

### migrate-data-to-typeorm.ts
```
🚀 Starting Data Migration: Knex → TypeORM
═══════════════════════════════════════════════

📝 Migrating Users...
   Found 150 users to migrate
✅ Migrated 150 users

📝 Migrating Tournaments...
   ℹ️ Legacy tournaments table not found - skipping

📝 Migrating Blind Schedules...
   Found 450 blind levels to migrate
✅ Migrated 450 blind schedules

═══════════════════════════════════════════════
✅ MIGRATION COMPLETED
═══════════════════════════════════════════════

📊 Migration Summary:
   Users:          150
   Tournaments:    0
   Blind Schedules:450
   Player Entries: 320
   Penalties:      12
   ─────────────────────
   Total Migrated: 932
   Errors:         0
   Duration:       4.52s

🎉 All data migrated successfully!
```

### validate-migration.ts
```
🔍 Starting Data Migration Validation
═════════════════════════════════════════════════

📊 Validating Entity Counts...
   Users: 150
   Player Entries: 320
   Blind Schedules: 450

🔗 Validating Foreign Key Relationships...
   PlayerEntry → User: 5/5
   PlayerEntry → Tournament: 5/5

📋 Validating Data Types...
   User: testuser
     - email: string (expected: string)
     - role: string (expected: string)
     - followersCount: number (expected: number)

═════════════════════════════════════════════════
📋 VALIDATION REPORT

✅ Users count: 150/150
✅ Player Entries count: 320/320
✅ Blind Schedules count: 450/450
✅ Foreign key: PlayerEntry.player: 5/5
✅ Foreign key: PlayerEntry.tournament: 5/5
✅ Data types validation: 1/1
✅ Repository queries: 1/1

📊 Summary: 7 passed, 0 failed, 0 warned

✅ VALIDATION SUCCESSFUL
```

## Siguientes pasos

Después de migración exitosa:

1. ✅ Verificar en aplicación (endpoints funcionando)
2. ✅ Ejecutar tests de integración
3. ✅ Commit cambios
4. ✅ Crear PR consolidando PHASE 7 + 7a
5. ✅ Merge a main
6. ✅ Deploy a staging
7. ✅ Deploy a production (con backup pre-deploy)
