import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../lib/prisma"
import z from "zod"

export async function getPoll(app: FastifyInstance){
  app.get('/polls/:pollId', async (req:FastifyRequest, res:FastifyReply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId }  = getPollParams.parse(req.params)
  
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: true
      }
    })

    
    return res.status(200).send({poll})
  })
}