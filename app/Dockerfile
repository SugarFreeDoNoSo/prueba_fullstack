FROM oven/bun:1 AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./
# COPY bun.lockb ./

# Instalar dependencias
RUN bun install

# Copiar el resto de los archivos
COPY . .

RUN bunx astro build

EXPOSE 4321

# Comando para ejecutar en producción
CMD ["bunx", "astro", "preview", "--host", "0.0.0.0"]