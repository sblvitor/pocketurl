import fastify from "fastify";

const app = fastify({ logger: true })

app.get('/health', async () => ({ ok: true }))

const links = new Map<string, string>([
  ['gh', 'https://github.com/'],
  ['mdn', 'https://developer.mozilla.org']
])

app.get<{ Params: { code: string } }>(
  '/:code',
  async (request, reply) => {
    const { code } = request.params
    const url = links.get(code)
    if (!url) return reply.code(404).send({ message: 'Link not found!' })

    return reply.redirect(url, 302)
  })

try {
  await app.listen({ port: 3333 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
