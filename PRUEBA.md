# Prueba Fullstack - Pokémon TCG API y Frontend

¡Bienvenido a la prueba técnica para desarrolladores Fullstack! En esta prueba, trabajarás con una base de datos que contiene información de los sets y cartas del juego Pokémon TCG. Tu objetivo será construir un backend con una API REST y un frontend para listar y visualizar esta información. 

## Objetivo de la Prueba

1. **Backend**:
   - Implementar un backend con una API REST utilizando la base de datos provista (PostgreSQL).
   - Construir endpoints para listar:
     - Los sets disponibles.
     - Las cartas correspondientes a cada set.
     - (Opcional) Información detallada de una carta específica.

2. **Frontend**:
   - Construir una aplicación web para:
     - Listar los sets disponibles.
     - Mostrar las cartas correspondientes a cada set.
     - (Opcional) Visualizar información detallada de una carta en una vista individual.

3. **Infraestructura**:
   - Usar Docker para la configuración del entorno de desarrollo, incluyendo la base de datos y la API.

## Requisitos

### Obligatorios
- Backend en **Node.js**, **Python** (Flask/Django), o cualquier lenguaje de tu preferencia.
- Frontend en **React**, **Vue**, **Nextjs** o **Astro**.
- Documentación clara de los endpoints en el backend.

### Suma Puntos
Sabemos que tu tiempo es valioso!, asi que si si logras implementar alguno de estos aspectos podrás sumar algunos punto extras

- Implementar una vista individual para cada carta en el frontend.
- Añadir un buscador o filtro en el frontend para buscar cartas por nombre, rareza, o tipo.
- Usar Tailwind para estilizar el frontend.
- Desplegar la base de datos PostgreSQL mediante Docker.
- Desplegar la aplicación mediante Docker.

## Base de Datos
El esquema de la base de datos contiene las siguientes tablas:

1. **set**:
   - Información sobre los sets de cartas (nombre, serie, cantidad total, fecha de lanzamiento, etc.).

2. **card**:
   - Información de las cartas (nombre, supertipo, subtipo, rareza, etc.).
   - Relación con un set específico.

3. **image**:
   - URLs de imágenes de las cartas.

4. **market**:
   - Información del mercado relacionada con las cartas.

Puedes ver el esquema completo en el archivo `resources/database-diagram.png` incluido.

## Instrucciones

1. **Configuración del Entorno**:
   - Clona este repositorio.
   - Carga la base de datos en PostgreSQL usando el backup incluido (`database_backup.sql`).
   - (Opcional) Configura un contenedor Docker para la base de datos.

2. **Backend**:
   - Configura tu backend para conectarse a la base de datos PostgreSQL.
   - Implementa los siguientes endpoints:
     - `GET /sets`: Lista todos los sets.
     - `GET /sets/:id/cards`: Lista todas las cartas de un set específico.
     - (Opcional) `GET /cards/:id`: Devuelve información detallada de una carta.

3. **Frontend**:
   - Construye una interfaz de usuario que:
     - Liste los sets disponibles.
     - Muestra las cartas de un set seleccionado.
     - (Opcional) Visualiza información detallada de una carta.

4. **Ejecución**:
   - Proporciona instrucciones claras en este archivo para ejecutar la aplicación.
   - (Opcional) Usa Docker Compose para levantar la base de datos, el backend y el frontend.

## Entrega

Por favor, entrega tu solución de la siguiente manera:
- Un repositorio en GitHub con el código del backend, frontend, y los archivos de configuración de Docker.
- Instrucciones claras en este archivo para ejecutar la aplicación.
- (Opcional) Un enlace a un despliegue funcional (por ejemplo, en Heroku, Vercel, o similares).
- **Tienes 1 semana para entregar una vez aceptado el desafío**

## Evaluación

Se evaluará:
- Correcta implementación de los endpoints requeridos.
- Funcionalidad y diseño del frontend.
- Organización y claridad del código.
- Documentación.
- Implementación de las características opcionales (si aplica).

¡Buena suerte y que la creatividad te acompañe!
