FROM oven/bun:1 AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./
# COPY bun.lockb ./

# Instalar dependencias
RUN bun install

# Copiar el resto de los archivos
COPY . .

EXPOSE 4321

# Comando para ejecutar en producción
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]