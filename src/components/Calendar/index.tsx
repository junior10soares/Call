import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { api } from '../../lib/auth/axios'
import { getWeekDays } from '../../utils/get-week-days'
import {
    CalendarActions,
    CalendarBody,
    CalendarContainer,
    CalendarDay,
    CalendarHeader,
    CalendarTitle,
} from './styles'

interface CalendarWeek {
    week: number
    days: Array<{
        date: dayjs.Dayjs
        disabled: boolean
    }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
    blockedWeekDays: number[]
    blockedDates: number[]
}

interface CalendarProps {
    selectedDate: Date | null
    onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set('date', 1)//so quero saber a inf do dia e do ano
    })

    const router = useRouter()

    function handlePreviousMonth() {
        const previousMonth = currentDate.subtract(1, 'month')// diminui um mes

        setCurrentDate(previousMonth)
    }

    function handleNextMonth() {
        const nextMonth = currentDate.add(1, 'month')//add um mes

        setCurrentDate(nextMonth)
    }

    const shortWeekDays = getWeekDays({ short: true })

    const currentMonth = currentDate.format('MMMM')
    const currentYear = currentDate.format('YYYY')

    const username = String(router.query.username)

    const { data: blockedDates } = useQuery<BlockedDates>(
        ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
        async () => {
            const response = await api.get(`/users/${username}/blocked-dates`, {
                params: {
                    year: currentDate.get('year'),
                    month: currentDate.get('month') + 1,
                },
            })

            return response.data
        },
    )

    const calendarWeeks = useMemo(() => {//dias da semana

        if (!blockedDates) {
            return []
        }

        const daysInMonthArray = Array.from({
            length: currentDate.daysInMonth(),//retorna qts dias atuais q tenho do mes 
        }).map((_, i) => {
            return currentDate.set('date', i + 1)//substitua pelo dia i + 1 pq começa com 0
        })

        const firstWeekDay = currentDate.get('day')//dia da semana q falta p preencher a linha da semana

        const previousMonthFillArray = Array.from({
            length: firstWeekDay,
        })
            .map((_, i) => {
                return currentDate.subtract(i + 1, 'day')// pegando a data e "voltando p trás os dias"
            })
            .reverse()

        const lastDayInCurrentMonth = currentDate.set(
            'date',
            currentDate.daysInMonth(),
        )
        const lastWeekDay = lastDayInCurrentMonth.get('day')

        const nextMonthFillArray = Array.from({
            length: 7 - (lastWeekDay + 1),
        }).map((_, i) => {
            return lastDayInCurrentMonth.add(i + 1, 'day')
        })

        const calendarDays = [
            ...previousMonthFillArray.map((date) => {//retorna o mes anterios desab
                return { date, disabled: true }
            }),
            ...daysInMonthArray.map((date) => {//retorna o mes anterios hab
                return {
                    date,
                    disabled:
                        date.endOf('day').isBefore(new Date()) ||
                        blockedDates.blockedWeekDays.includes(date.get('day')) ||
                        blockedDates.blockedDates.includes(date.get('date')),
                }
            }),
            ...nextMonthFillArray.map((date) => {//retorna o mes anterios desab
                return { date, disabled: true }
            }),
        ]

        const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
            (weeks, _, i, original) => {
                const isNewWeek = i % 7 === 0

                if (isNewWeek) {
                    weeks.push({
                        week: i / 7 + 1,
                        days: original.slice(i, i + 7),
                    })
                }

                return weeks
            },
            [],
        )

        return calendarWeeks
    }, [currentDate, blockedDates])

    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarTitle>
                    {currentMonth} <span>{currentYear}</span>
                </CalendarTitle>

                <CalendarActions>
                    <button onClick={handlePreviousMonth} title="Previous month">
                        <CaretLeft />
                    </button>
                    <button onClick={handleNextMonth} title="Next month">
                        <CaretRight />
                    </button>
                </CalendarActions>
            </CalendarHeader>

            <CalendarBody>
                <thead>
                    <tr>
                        {shortWeekDays.map((weekDay) => (// importou de utils get weeks dias da sem
                            <th key={weekDay}>{weekDay}.</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarWeeks.map(({ week, days }) => {
                        return (
                            <tr key={week}>
                                {days.map(({ date, disabled }) => {
                                    return (
                                        <td key={date.toString()}>
                                            <CalendarDay
                                                onClick={() => onDateSelected(date.toDate())}
                                                disabled={disabled}
                                            >
                                                {date.get('date')}
                                            </CalendarDay>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </CalendarBody>
        </CalendarContainer>
    )
}