import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const app = Fastify({
  logger: true
})

await app.register(swagger, {
  openapi: {
    info: {
      title: "PocketURL API",
      description: "URL Shortener API",
      version: "1.0.0",
    }
  }
})

await app.register(swaggerUi, { routePrefix: "/docs" })

app.get("/health", async () => ({ status: "ok" }))

// Armazenamento temporário
const links = new Map<string, string>()

app.post('/links', async (request, reply) => {
  const { url } = request.body as { url: string }
  const code = Math.random().toString(36).slice(2, 8)
  links.set(code, url)

  reply.code(201)
  return { code, url }
})

app.get('/:code', async (request, reply) => {
  const { code } = request.params as { code: string }
  const url = links.get(code)

  if (!url) {
    reply.code(404)
    return { message: 'Link não encontrado' }
  }

  return reply.redirect(url, 302)
})

const start = async () => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
