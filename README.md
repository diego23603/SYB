# Sistema de Gestión de Salud y Bienestar con Monitorización Avanzada

Este proyecto implementa una plataforma empresarial de gestión de salud y bienestar con capacidades avanzadas de observabilidad y monitorización del rendimiento. El sistema está diseñado con una arquitectura moderna de microservicios y utiliza las mejores prácticas de DevOps para el monitoreo y logging.

## 🚀 Características Principales

### Gestión de Productos
- Interfaz de usuario intuitiva para gestionar productos de salud y bienestar
- Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar)
- Validación de datos en tiempo real
- Gestión de inventario con indicadores visuales
- Categorización de productos
- Precios y descripción detallada

### Monitorización y Observabilidad
- **Stack ELK (Elasticsearch, Logstash, Kibana)**
  - Centralización de logs
  - Análisis en tiempo real
  - Visualización avanzada de datos
  - Búsqueda y filtrado de logs

- **Prometheus & Grafana**
  - Métricas de rendimiento en tiempo real
  - Monitorización de recursos del sistema
  - Dashboards personalizables
  - Alertas configurables

### Métricas Principales
1. **Métricas de Recursos del Contenedor:**
   - Uso de CPU (container_cpu_usage_seconds_total)
   - Uso de Memoria (container_memory_usage_bytes)
   - E/S de Red:
     * Bytes Recibidos (container_network_receive_bytes_total)
     * Bytes Transmitidos (container_network_transmit_bytes_total)

2. **Métricas de la Aplicación:**
   - Total de Peticiones HTTP (http_requests_total)
   - Total de Productos (products_total)
   - Nivel de Stock por Producto (product_stock_level)

3. **Métricas del Sistema:**
   - Carga Promedio del Sistema (node_load1, node_load5, node_load15)
   - Uso de Disco (node_filesystem_avail_bytes)
   - Memoria del Sistema (node_memory_MemAvailable_bytes)

## 🛠️ Tecnologías Utilizadas

### Frontend
- React con soporte de internacionalización
- TailwindCSS para estilos
- Shadcn/ui para componentes
- React Query para gestión del estado
- Wouter para enrutamiento

### Backend
- Node.js con Express
- PostgreSQL con Drizzle ORM
- API RESTful
- Validación con Zod

### Monitorización
- Prometheus para recolección de métricas
- Grafana para visualización
- Node Exporter para métricas del sistema
- cAdvisor para métricas de contenedores

### Logging
- Elasticsearch para almacenamiento y búsqueda
- Logstash para procesamiento de logs
- Kibana para visualización y análisis

### Infraestructura
- Docker y Docker Compose
- Contenedores para todos los servicios
- Redes aisladas para monitorización y logging

## 🔧 Configuración de Puertos

- **Aplicación Principal:** Puerto 5000 (http://localhost:5000)
  - Interfaz web y API REST

- **Elasticsearch:** Puerto 9200 (http://localhost:9200)
  - Base de datos para almacenamiento de logs

- **Kibana:** Puerto 5601 (http://localhost:5601)
  - Panel de visualización de logs

- **Logstash:**
  - Puerto 5044 (TCP/UDP) para recepción de logs
  - Puerto 9600 para monitorización

- **Prometheus:** Puerto 9090 (http://localhost:9090)
  - Recolección y almacenamiento de métricas

- **Grafana:** Puerto 3000 (http://localhost:3000)
  - Visualización de métricas
  - Credenciales por defecto: admin/admin

## 📦 Estructura del Proyecto

```
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/          # Utilidades y configuración
│   │   └── pages/        # Componentes de página
├── db/                    # Configuración de base de datos
│   ├── schema.ts         # Schema Drizzle
│   └── index.ts          # Configuración de conexión
├── logstash/             # Configuración de Logstash
│   └── pipeline/
├── server/               # Backend Node.js
│   ├── routes.ts        # Rutas de API
│   └── index.ts         # Configuración del servidor
└── docker-compose.yml    # Configuración de servicios
```

## 🚀 Instalación y Despliegue

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/diego23603/SYB.git
   cd SYB
   ```

2. **Configurar variables de entorno:**
   - Configurar las credenciales de la base de datos

3. **Iniciar servicios con Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Acceder a los servicios:**
   - Aplicación web: http://localhost:5000
   - Grafana: http://localhost:3000
   - Kibana: http://localhost:5601
   - Prometheus: http://localhost:9090

## 📊 Dashboards y Visualización

### Grafana
- Acceder a http://localhost:3000
- Credenciales por defecto: admin/admin
- Importar dashboards predefinidos o crear nuevos
- Métricas disponibles para:
  * Rendimiento de la aplicación
  * Uso de recursos del sistema
  * Métricas de contenedores
  * Estadísticas de productos

### Kibana
- Acceder a http://localhost:5601
- Crear index patterns para los logs
- Visualizar y analizar logs en tiempo real
- Crear dashboards personalizados

## 🔍 Monitorización y Logging

### Prometheus
- Recolección automática de métricas
- Endpoints monitorizados:
  * `/metrics` de la aplicación
  * node-exporter para métricas del sistema
  * cAdvisor para métricas de contenedores

### ELK Stack
- Logstash procesa y enruta los logs
- Elasticsearch almacena y indexa los logs
- Kibana proporciona visualización y análisis

## 🛡️ Seguridad

- Redes Docker aisladas para monitorización y logging
- Credenciales configurables para servicios
- CORS y validación de datos implementados
- Sanitización de entradas de usuario

## 🤝 Contribución

1. Fork el repositorio
2. Crear una rama para la feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request


