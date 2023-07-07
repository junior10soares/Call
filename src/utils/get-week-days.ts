interface GetWeekDaysParams {
    short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
    const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })//por escrito dia da semana

    return Array.from(Array(7).keys())//retorna indice do array 7 posiçoes
        .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
        .map((weekDay) => {
            if (short) { //se for short retorna os 3 primeiros dias da semana em maisc
                return weekDay.substring(0, 3).toUpperCase()
            }
            return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1));//primeira maiusc
        });
}

