FROM oven/bun:1 AS builder
WORKDIR /app
COPY . .
RUN bun i
RUN bun run build
RUN bun run build:bin

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["./server"]