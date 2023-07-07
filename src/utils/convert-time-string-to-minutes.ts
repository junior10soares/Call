export function convertTimeToStringToMinutes(timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number) // converte a hrs em min

    return hours * 60 + minutes
}