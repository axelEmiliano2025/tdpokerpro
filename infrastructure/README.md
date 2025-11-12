# Infrastructure - TDPokerPro Platform

Configuración de infraestructura, Docker, Kubernetes y CI/CD.

## Estructura

```
infrastructure/
├── docker/              # Dockerfiles personalizados
├── kubernetes/          # Manifests de K8s (deployments, services, ingress)
└── ci-cd/              # Pipelines de GitHub Actions
```

## Componentes

### Docker
- Dockerfiles para cada servicio backend
- Docker Compose para desarrollo local
- Multi-stage builds para optimización

### Kubernetes
- Deployments para cada microservicio
- Services (ClusterIP, LoadBalancer)
- Ingress para routing
- ConfigMaps y Secrets
- HorizontalPodAutoscaler
- PersistentVolumeClaims

### CI/CD
- GitHub Actions workflows
- Tests automatizados
- Build y push a registry
- Deploy automático a staging/production

## Tecnologías

- Docker 20+
- Kubernetes 1.28+
- Helm Charts
- GitHub Actions
- Prometheus + Grafana (monitoring)
