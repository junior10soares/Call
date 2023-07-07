import { api } from "@/src/lib/auth/axios";
import { convertTimeToStringToMinutes } from "@/src/utils/convert-time-string-to-minutes";
import { getWeekDays } from "@/src/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Header } from "../styles";
import { FormErrors, IntervalBox, IntervalContainer, IntervalDay, IntervalInputs, IntervalItem } from "./styles";

const timeIntervalsFormSchema = z.object({
    intervals: z.array(z.object({//é um array de obj
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string()
    }),
    ).length(7)//receber tds dias da semana
        .transform(intervals => intervals.filter((interval) => interval.enabled))//transf o array e retorna so os true
        .refine(intervals => intervals.length > 0, {// validação p o array ser retornado smp > q 0
            message: 'Voce precisa selecionar pelo menos um dia da semana!'
        })
        .transform((intervals) => {//transfor só os enable e fez um map transf hr em min
            return intervals.map((interval) => {
                return {
                    weekDay: interval.weekDay,
                    startTimeInMinutes: convertTimeToStringToMinutes(interval.startTime),//importo a funcao e ta usando dentro do intavel start
                    endTimeInMinutes: convertTimeToStringToMinutes(interval.endTime)
                }
            })
        })
        .refine(intervals => {//quero verificar se TODOS cumprem intervalo de hrs em 1 hora
            return intervals.every((interval) =>
                interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
            )
        }, {
            message: 'O horario de termino deve ser pelo menos 1h distante do inicio'
        }
        )
})
type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {

    const { register, handleSubmit, control, watch, formState: { isSubmitting, errors } } = useForm<TimeIntervalsFormInput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
                { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
            ]
        }
    })

    const router = useRouter()

    const weekDays = getWeekDays()//passa o dia da semana como indice

    const { fields } = useFieldArray({//manipula o array de cima
        control,
        name: 'intervals'
    })

    const intervals = watch('intervals') // verifica tds mudança no campo de intervalss

    async function handleSetTimeIntervals(data: any) {
        const { intervals } = data as TimeIntervalsFormOutput

        await api.post("/users/time-intervals", {//mostre os dados da api
            intervals,
        });

        await router.push('/register/update-profile')//manda p essa pag
    }

    return (
        <>
            <NextSeo
                title="Selecione sua disponibilidade | Ignite Call" noindex
            />
            <Container>
                <Header>
                    <Heading as='strong'>Quase lá</Heading>
                    <Text>
                        Defina o intervalo de horarios que voce esta disponivel em cada dia da
                        semana.
                    </Text>

                    <MultiStep size={4} currentStep={3} //4 etapas e começa na primeira
                    />
                </Header>

                <IntervalBox as='form' onSubmit={handleSubmit(handleSetTimeIntervals)}>
                    <IntervalContainer>

                        {fields.map((field, index) => {
                            return (
                                <IntervalItem key={field.id}>
                                    <IntervalDay>
                                        <Controller
                                            name={`intervals.${index}.enabled`}
                                            control={control}
                                            render={({ field }) => {//controlar o checked
                                                return (
                                                    <Checkbox
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked === true)
                                                        }}
                                                        checked={field.value}
                                                    />
                                                )
                                            }}
                                        />
                                        <Text>{weekDays[field.weekDay]}</Text>
                                    </IntervalDay>
                                    <IntervalInputs>
                                        <TextInput
                                            size="sm"
                                            type="time"
                                            step={60}
                                            disabled={intervals[index].enabled === false}// desabi o input quando estiver desabi
                                            {...register(`intervals.${index}.startTime`)}
                                        />
                                        <TextInput
                                            size="sm"
                                            type="time"
                                            step={60}
                                            disabled={intervals[index].enabled === false}// desabi o input quando estiver desabi
                                            {...register(`intervals.${index}.endTime`)}
                                        />
                                    </IntervalInputs>
                                </IntervalItem>
                            )
                        })}

                    </IntervalContainer>

                    {errors.intervals && (
                        <FormErrors size='sm'>{errors.intervals.message}</FormErrors>
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        Próximo passo
                        <ArrowRight />
                    </Button>

                </IntervalBox>

            </Container>
        </>

    )
}