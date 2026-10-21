import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const app = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

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

const CreateLinkBody = Type.Object({
  url: Type.String({ format: 'uri', pattern: '^https?://' }),
}, { additionalProperties: false })

app.post('/links', { schema: { body: CreateLinkBody } }, async (request, reply) => {
  const { url } = request.body
  const code = Math.random().toString(36).slice(2, 8)
  links.set(code, url)

  reply.code(201)
  return { code, url }
})

const RedirectParam = Type.Object({
  code: Type.String()
})

app.get('/:code', { schema: { params: RedirectParam } }, async (request, reply) => {
  const { code } = request.params
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
