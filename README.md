
# Proyecto Pokémon TCG

## Configuración con Docker

Para levantar el proyecto utilizando Docker, sigue estos pasos:

### Requisitos previos
- Docker instalado en tu sistema
- Docker Compose instalado en tu sistema

### Pasos para levantar el proyecto

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone git@github.com:SugarFreeDoNoSo/prueba_fullstack.git
   cd prueba_fullstack
   ```

2. Construye y levanta los contenedores con Docker Compose:
   ```bash
   docker compose up -d
   ```

3. Accede a la aplicación:
   - Frontend: http://localhost:4321
   - API Backend: http://localhost:3000

## Documentación

La API cuenta con documentación interactiva generada con Swagger UI:
- Accede a la documentación en: http://localhost:3000/docs
- La documentación incluye todos los endpoints disponibles, parámetros requeridos y ejemplos de respuestas.
- Puedes probar los endpoints directamente desde la interfaz de Swagger UI: http://localhost:3000/swagger

### Estructura del proyecto
- `/app`: Aplicación frontend con Astro
- `/api`: Servidor backend con Hono

### Detener el proyecto
Para detener los contenedores: 
   ```bash
   docker compose down
   ```
