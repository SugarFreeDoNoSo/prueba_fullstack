import { serve } from '@hono/node-server'
import { eq } from 'drizzle-orm';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

import { db, set, card, market, image } from '@db';

// Define route schemas
const routes = {
  welcome: createRoute({
    method: 'get',
    path: '/api',
    tags: ['General'],
    description: 'Welcome endpoint',
    responses: {
      200: {
        description: 'Welcome message',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'Pokemon TCG API - Bienvenido!'
            }
          }
        }
      }
    }
  }) as any,

  getAllSets: createRoute({
    method: 'get',
    path: '/sets',
    tags: ['Sets'],
    description: 'Get all Pokemon card sets',
    responses: {
      200: {
        description: 'List of all sets',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  series: { type: 'string' },
                  printedTotal: { type: 'number' },
                  total: { type: 'number' },
                  releaseDate: { type: 'string' },
                  updatedAt: { type: 'string' },
                  symbolUrl: { type: 'string' },
                  logoUrl: { type: 'string' }
                }
              }
            }
          }
        }
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }) as any,

  getSetCards: createRoute({
    method: 'get',
    path: '/sets/{id}/cards',
    tags: ['Cards'],
    description: 'Get all cards from a specific set',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string'
        },
        description: 'Set ID'
      }
    ],
    responses: {
      200: {
        description: 'List of cards in the set',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  supertype: { type: 'string' },
                  subtypes: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  types: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  setId: { type: 'string' },
                  number: { type: 'string' },
                  rarity: { type: 'string' },

                }
              }
            }
          }
        }
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      },
      404: {
        description: 'Set not found or has no cards',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }) as any,

  getCardDetails: createRoute({
    method: 'get',
    path: '/cards/{id}',
    tags: ['Cards'],
    description: 'Get detailed information about a specific card',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string'
        },
        description: 'Card ID'
      }
    ],
    responses: {
      200: {
        description: 'Card details including market data and images',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                supertype: { type: 'string' },
                subtypes: { type: 'array', items: { type: 'string' } },
                types: { type: 'array' },
                setId: { type: 'string' },
                number: { type: 'string' },
                rarity: { type: 'string' },
                Market: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      cardId: { type: 'string' },
                      url: { type: 'string' },
                      updatedAt: { type: 'string' },
                      market: { type: 'string' }
                    }
                  }
                },
                Image: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      cardId: { type: 'string' },
                      url: { type: 'string' },
                      type: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      },
      404: {
        description: 'Card not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }) as any
}

const app = new OpenAPIHono()

// Register routes
app.openapi(routes.welcome, (c) => c.text('Pokemon TCG API - Bienvenido!'))

app.openapi(routes.getAllSets, async (c) => {
  try {
    const sets = await db.select().from(set)
    return c.json(sets)
  } catch (error) {
    console.error('Error fetching sets:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

app.openapi(routes.getSetCards, async (c) => {
  try {
    const setId = c.req.param('id')
    if (!setId) return c.json({ error: 'ID de set requerido' }, 400)

    const cards = await db.select().from(card).where(eq(card.setId, setId))
    if (cards.length === 0) {
      return c.json({ error: 'Set no encontrado o sin cartas' }, 404)
    }

    return c.json(cards)
  } catch (error) {
    console.error('Error fetching cards:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

app.openapi(routes.getCardDetails, async (c) => {
  try {
    const cardId = c.req.param('id')
    if (!cardId) return c.json({ error: 'ID de carta requerido' }, 400)

    const Card = await db.select().from(card).where(eq(card.id, cardId))
    if (Card.length === 0) {
      return c.json({ error: 'Carta no encontrada' }, 404)
    }

    const Market = await db.select().from(market).where(eq(market.cardId, cardId))
    const Image = await db.select().from(image).where(eq(image.cardId, cardId))

    const CardDetails = {
      ...Card[0],
      Market,
      Image
    }


    return c.json(
      CardDetails
    )
  } catch (error) {
    console.error('Error fetching card details:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// Add Swagger UI
app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'Pokemon TCG API',
    version: '1.0.0',
    description: 'API para consultar información sobre cartas Pokemon'
  },
  tags: [
    { name: 'General', description: 'Endpoints generales' },
    { name: 'Sets', description: 'Operaciones con sets de cartas' },
    { name: 'Cards', description: 'Operaciones con cartas individuales' }
  ]
})

app.get('/swagger', swaggerUI({ url: '/docs' }))

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  console.log('Documentation available at:')
  console.log(`- OpenAPI JSON: http://localhost:${info.port}/docs`)
  console.log(`- Swagger UI: http://localhost:${info.port}/swagger`)
})
