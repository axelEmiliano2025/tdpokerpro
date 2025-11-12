# Scripts - TDPokerPro Platform

Scripts de utilidad para desarrollo, deployment y mantenimiento.

## Scripts Disponibles

### Desarrollo
- `setup.sh` - Setup inicial del proyecto
- `dev.sh` - Iniciar todos los servicios en desarrollo
- `test-all.sh` - Ejecutar todos los tests

### Base de Datos
- `db-migrate.sh` - Ejecutar migraciones
- `db-seed.sh` - Poblar con datos de prueba
- `db-backup.sh` - Backup de base de datos
- `db-restore.sh` - Restaurar backup

### Deployment
- `deploy-staging.sh` - Deploy a staging
- `deploy-production.sh` - Deploy a producción
- `rollback.sh` - Rollback a versión anterior

### Mantenimiento
- `clean.sh` - Limpiar archivos temporales
- `update-deps.sh` - Actualizar dependencias
- `generate-docs.sh` - Generar documentación

## Uso

```bash
# Dar permisos de ejecución
chmod +x scripts/*.sh

# Ejecutar script
./scripts/setup.sh
```
