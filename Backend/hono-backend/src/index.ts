import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()


// Datos de prueba
const sets = [
  { id: 1, name: 'Base Set', releaseDate: '1999-01-09' },
  { id: 2, name: 'Jungle', releaseDate: '1999-06-16' },
  { id: 3, name: 'Fossil', releaseDate: '1999-10-10' }
]

const cards = [
  { id: 1, setId: 1, name: 'Charizard', type: 'Fire', rarity: 'Rare' },
  { id: 2, setId: 1, name: 'Pikachu', type: 'Electric', rarity: 'Common' },
  { id: 3, setId: 2, name: 'Snorlax', type: 'Normal', rarity: 'Rare' }
]

// Ruta principal
app.get('/', (c) => {
  return c.text('Pokemon TCG API - Bienvenido!')
})

// Lista todos los sets
app.get('/sets', (c) => {
  // const sets = getSets();
  return c.json(sets)
})

// Lista todas las cartas de un set específico
app.get('/sets/:id/cards', (c) => {
  const setId = Number(c.req.param('id'))
  const setCards = cards.filter(card => card.setId === setId)
  
  if (setCards.length === 0) {
    return c.json({ error: 'Set no encontrado o sin cartas' }, 404)
  }
  
  return c.json(setCards)
})

// (Opcional) Devuelve información detallada de una carta
app.get('/cards/:id', (c) => {
  const cardId = Number(c.req.param('id'))
  const card = cards.find(card => card.id === cardId)
  
  if (!card) {
    return c.json({ error: 'Carta no encontrada' }, 404)
  }
  
  return c.json(card)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
