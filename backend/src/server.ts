import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { DatabaseError } from 'pg'
import { db, pool } from './db.js'
import { links } from './db/schema.js'
import { eq } from 'drizzle-orm'

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

const CreateLinkBody = Type.Object({
  code: Type.Optional(Type.String({ pattern: '^[a-zA-Z0-9_-]{3,32}$' })),
  url: Type.String({ format: 'uri', pattern: '^https?://' }),
}, { additionalProperties: false })

app.post('/links', { schema: { body: CreateLinkBody } }, async (request, reply) => {
  const { url } = request.body
  const code = request.body.code ?? Math.random().toString(36).slice(2, 8)

  try {
    const [link] = await db
      .insert(links)
      .values({ code, url })
      .returning({ code: links.code, url: links.url })

    reply.code(201)
    return link
  } catch (err) {
    if (err instanceof Error && err.cause instanceof DatabaseError && err.cause.code === '23505') {
      reply.code(409)
      return { message: 'Esse código já está em uso' }
    }
    throw err
  }

})

const RedirectParam = Type.Object({
  code: Type.String()
})

app.get('/:code', { schema: { params: RedirectParam } }, async (request, reply) => {
  const { code } = request.params
  const [link] = await db
    .select({ url: links.url })
    .from(links)
    .where(eq(links.code, code))

  if (!link) {
    reply.code(404)
    return { message: 'Link não encontrado' }
  }

  return reply.redirect(link.url, 302)
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
