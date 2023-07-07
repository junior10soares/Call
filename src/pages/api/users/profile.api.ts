import { prisma } from "@/src/lib/auth/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";

const updateProfileBodySchema = z.object({
    bio: z.string()
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).end()
    }
    const session = await unstable_getServerSession(req, res, buildNextAuthOptions(req, res))

    if (!session) {//nao autenticado
        return res.status(401).end
    }

    const { bio } = updateProfileBodySchema.parse(req.body)//pegou o intervals de body

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            bio // coloco a bio no backend
        }
    })

    return res.status(204).end()//204 sucesso resposta sem conteudo
}

