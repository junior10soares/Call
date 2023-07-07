import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/auth/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {//metodo get busca informação
        return res.status(405).end()
    }

    const username = String(req.query.username)
    const { date } = req.query

    if (!date) {
        return res.status(400).json({ message: 'Date no provided.' })
    }

    const user = await prisma.user.findUnique({ // pega do banco de dados
        where: {
            username,
        },
    })

    if (!user) {
        return res.status(400).json({ message: 'User does not exist.' })
    }

    const referenceDate = dayjs(String(date))//data de referencia
    const isPastDate = referenceDate.endOf('day').isBefore(new Date())

    if (isPastDate) {// n existe possibilidade de hr
        return res.json({ possibleTimes: [], availableTimes: [] })
    }

    const userAvailability = await prisma.userTimeInterval.findFirst({//pega no banco de dados 
        where: {
            user_id: user.id,
            week_day: referenceDate.get('day'),//o dia da semana seja igual o dia q estou chamando disponivel
        },
    })

    if (!userAvailability) {// se o usuario n tiver dispo de horario
        return res.json({ possibleTimes: [], availableTimes: [] })//retorna vazio
    }

    const { time_start_in_minutes, time_end_in_minutes } = userAvailability// se tiver

    const startHour = time_start_in_minutes / 60 // 10 retorna em hrs
    const endHour = time_end_in_minutes / 60//18

    const possibleTimes = Array.from({ length: endHour - startHour }).map(
        (_, i) => {
            return startHour + i
        },
    )

    const blockedTimes = await prisma.scheduling.findMany({//tds agendamento q foram feito pelo usuario entre 10 as 18hr
        select: {//só trazer a date
            date: true
        },
        where: {
            user_id: user.id,
            date: {
                gte: referenceDate.set('hour', startHour).toDate(),//get = maior ou igual há ...
                lte: referenceDate.set('hour', endHour).toDate(),//get = menor ou igual há ...
            }
        }
    })


    const availableTimes = possibleTimes.filter(time => {//nao existe nenhum horario com um horario do agendamento

        const isTimeBlocked = blockedTimes.some(
            (blockedTime) => blockedTime.date.getHours() === time,
        )

        const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

        return !isTimeBlocked && !isTimeInPast
    })

    return res.json({ possibleTimes, availableTimes })
}