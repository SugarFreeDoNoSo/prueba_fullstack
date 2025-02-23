import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm';
import { db, set, card, market, image } from '@db';

const app = new Hono()

// Ruta principal
app.get('/api', (c) => {
  return c.text('Pokemon TCG API - Bienvenido!')
})

// Lista todos los sets
app.get('/sets', async (c) => {
  const sets = await db.select().from(set)
  return c.json(sets)
})

// Lista todas las cartas de un set específico
app.get('/sets/:id/cards', async (c) => {
  const setId = c.req.param('id')
  const cards = await db.select().from(card).where(eq(card.setId, setId))

  if (cards.length === 0) {
    return c.json({ error: 'Set no encontrado o sin cartas' }, 404)
  }
  
  return c.json(cards)
})

// Devuelve información detallada de una carta
app.get('/cards/:id', async (c) => {
  const cardId = c.req.param('id')
  const Card = await db.select().from(card).where(eq(card.id, cardId))
  
  if (Card.length === 0) {
    return c.json({ error: 'Carta no encontrada' }, 404)
  }

  const Market = await db.select().from(market).where(eq(market.cardId, cardId))
  const Image = await db.select().from(image).where(eq(image.cardId, cardId))
  
  const res = {Card, Market, Image}
  
  return c.json(res)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
