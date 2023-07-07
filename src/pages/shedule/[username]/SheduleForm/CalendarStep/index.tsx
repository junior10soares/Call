import { Calendar } from "@/src/components/Calendar";
import { api } from "@/src/lib/auth/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from "./styles";

interface Availability {
    possibleTimes: number[]
    availableTimes: number[]
}

interface CalendarStepProps {
    onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {

    const [selectedDate, onDateSelected] = useState<Date | null>(null)

    const isDateSelected = !!selectedDate

    const router = useRouter()
    const username = router.query.username

    const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
    const describedDate = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null

    const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null

    const { data: availability } = useQuery<Availability>(['availability', selectedDateWithoutTime], async () => {
        const response = await api.get(`users/${username}/availability`, {
            params: {
                date: selectedDateWithoutTime
            },
        })
        return response.data
    },
        {
            enabled: !!selectedDate
        }
    )

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate()

        onSelectDateTime(dateWithTime)
    }

    return (
        <Container isTimePickerOpen={isDateSelected}>
            <Calendar selectedDate={selectedDate} onDateSelected={onDateSelected} />

            {isDateSelected && (
                <TimePicker>
                    <TimePickerHeader>
                        {weekDay} <span>{describedDate}</span>
                    </TimePickerHeader>

                    <TimePickerList>
                        {availability?.possibleTimes.map(hour => {
                            return (
                                <TimePickerItem
                                    key={hour}
                                    disabled={availability.availableTimes.includes(hour)}
                                    onClick={() => handleSelectTime(hour)}
                                >
                                    {String(hour).padStart(2, '0')}:00h</TimePickerItem>//se o horario for abaixo de 10 colocar 0 como padrao
                            )
                        })}
                    </TimePickerList>
                </TimePicker>
            )}
        </Container>
    )
}

