// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/src/lib/auth/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from "nookies"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') { // n quer q o metodo seja diferente do post
        return res.status(405).end()
    }

    const { name, username } = req.body // pega o nome e login

    const userExists = await prisma.user.findUnique({ //metodo procurar id iguais ja criados
        where: {
            username
        }
    })

    if (userExists) { // se ja existir 
        return res.status(400).json({ // mostre a msg de erro esse é o cod 400
            message: 'Username already taken.'
        })
    }

    const user = await prisma.user.create({
        data: {
            name,
            username
        }
    })

    setCookie({ res }, '@ignitecall:userId', user.id, {//usa o res p guardar inf no cookie @ é o nome e usa o ID p guardar a inf
        maxAge: 60 * 60 * 24 * 7, //7dias quando expira o cookie em segundos 60s * 60 1hr * 24 hr * 7 dias semana
        path: '/' //p o cookie ser acessado por tds pastas
    })

    return res.status(201).json(user)
}
