# Frontend - TDPokerPro Platform

Flutter app multiplataforma (iOS, Android, Web).

## Estructura

```
frontend/
├── lib/
│   ├── config/              # Configuración, rutas, tema
│   ├── core/                # Core utilities, errores, inyección
│   ├── shared/              # Widgets y código compartido
│   └── features/            # Features modulares
│       ├── authentication/
│       ├── tdpokerpro_admin/     # Gestión de clubes
│       ├── tdpokerpro_player/    # App del jugador
│       ├── social_feed/          # Red social
│       ├── notifications/
│       └── payments/
└── test/                    # Tests unitarios, integración, widgets
```

## Stack Tecnológico

- **Framework**: Flutter 3.35+
- **Lenguaje**: Dart 3.x
- **State Management**: Riverpod 3.0
- **Router**: go_router
- **HTTP**: dio
- **Storage**: flutter_secure_storage
- **Real-time**: socket_io_client
- **Testing**: flutter_test + mockito

## Arquitectura

Clean Architecture con feature-first organization.
Cada feature tiene sus propias capas: presentation, domain, data.

## Comandos

```bash
# Obtener dependencias
flutter pub get

# Ejecutar app
flutter run -d chrome  # Web
flutter run            # Móvil

# Tests
flutter test
flutter test --coverage

# Build
flutter build apk      # Android
flutter build ios      # iOS
flutter build web      # Web

# Análisis
flutter analyze
```
