# API

## funcciones serveles

```bash
bun run build
bun run start
```

## contenedor

```bash
docker build -t api_tcg:latest .
docker run -e DATABASE_URL="<url pg>" -p 127.0.0.1:3000:3000 api_tcg:latest 
```

