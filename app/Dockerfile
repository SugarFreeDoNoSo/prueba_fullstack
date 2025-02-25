FROM oven/bun:1 AS builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM node:lts-alpine AS runtime
COPY --from=builder ./app .
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs