import { serve } from '@hono/node-server'
import { eq } from 'drizzle-orm';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

import { db, set, card, market, image } from '@db';

const cache = new Map<string, { data: any, timestamp: number }>();
// Middleware para implementar caché en las respuestas
const cacheMiddleware = (timeToLive = 60000 * 60 * 24 * 30) => { // TTL predeterminado: 30 dias
  return async (c: any, next: () => any) => {
    const url = c.req.url;
    const method = c.req.method;
    const cacheKey = `${method}:${url}`;
    
    // Verificar si existe en caché y no ha expirado
    const cachedItem = cache.get(cacheKey);
    const now = Date.now();
    
    if (cachedItem && (now - cachedItem.timestamp) < timeToLive) {
      console.log(`🔄 Sirviendo respuesta desde caché para: ${cacheKey}`);
      return c.json(cachedItem.data);
    }
    
    // Si no está en caché o expiró, interceptar la respuesta
    const originalJson = c.json;
    c.json = function(data: any, status?: number, headers?: Record<string, string>) {
      // Guardar en caché solo para métodos GET
      if (method === 'GET') {
        cache.set(cacheKey, {
          data: data,
          timestamp: now
        });
        console.log(`💾 Guardando en caché: ${cacheKey}`);
      }
      
      // Llamar al método json original
      return originalJson.call(this, data, status, headers);
    };
    
    return await next();
  };
}

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

// Funciones controladores
const welcomeHandler = (c: any) => {
  return c.text('Pokemon TCG API - Bienvenido!')
}

const getAllSetsHandler = async (c: any) => {
  try {
    const sets = await db.select().from(set)
    return c.json(sets)
  } catch (error) {
    console.error('Error fetching sets:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
}

const getSetCardsHandler = async (c: any) => {
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
}

const getCardDetailsHandler = async (c: any) => {
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

    return c.json(CardDetails)
  } catch (error) {
    console.error('Error fetching card details:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
}

// Crear handlers combinados con caché
const cachedGetAllSetsHandler = async (c: any) => {
  const middleware = cacheMiddleware();
  return middleware(c, () => getAllSetsHandler(c));
}

const cachedGetSetCardsHandler = async (c: any) => {
  const middleware = cacheMiddleware();
  return middleware(c, () => getSetCardsHandler(c));
}

const cachedGetCardDetailsHandler = async (c: any) => {
  const middleware = cacheMiddleware();
  return middleware(c, () => getCardDetailsHandler(c));
}

const app = new OpenAPIHono()

// Registrar rutas con handlers que incluyen caché
app.openapi(routes.welcome, welcomeHandler)
app.openapi(routes.getAllSets, cachedGetAllSetsHandler)
app.openapi(routes.getSetCards, cachedGetSetCardsHandler)
app.openapi(routes.getCardDetails, cachedGetCardDetailsHandler)

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
