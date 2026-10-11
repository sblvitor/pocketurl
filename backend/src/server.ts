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

const start = async () => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
