import fastify from "fastify";

const app = fastify({ logger: true })

app.get('/health', async () => ({ ok: true }))

try {
  await app.listen({ port: 3333 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
