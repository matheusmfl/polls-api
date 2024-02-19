import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../lib/prisma"
import z from "zod"

export async function createPoll(app: FastifyInstance){
  app.post('/polls', async (req:FastifyRequest, res:FastifyReply) => {
    const createPollBody = z.object({
      title: z.string(),
    })
  
    const {title} = createPollBody.parse(req.body)
  
    const poll = await prisma.poll.create({
      data: {
        title
      }
    })
    return res.status(201).send({pollId: poll.id})
  })
}