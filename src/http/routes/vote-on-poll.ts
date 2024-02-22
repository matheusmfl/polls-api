import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../lib/prisma"
import z from "zod"
import { randomUUID } from "node:crypto"

export async function voteOnPoll(app: FastifyInstance){
  app.post('/polls/:pollId/votes', async (req:FastifyRequest, res:FastifyReply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const {pollId} = voteOnPollParams.parse(req.params)
    const {pollOptionId} = voteOnPollBody.parse(req.body)

    let {sessionId} = req.cookies
    console.log(sessionId)

    if(!sessionId){
      console.log('Entrou')
      sessionId = randomUUID()

      res.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24,
        signed: true,
        httpOnly: true
      })
    }



    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })
    
    return res.status(201).send({sessionId})
  })
}