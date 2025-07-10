export type TimeGroup = 'Manhã' | 'Tarde' | 'Noite'

export type TimeOption = {
  label: string // ex: "08:30"
  value: string // ex: "08:30:00"
  group: TimeGroup
}

export function generateTimeOptions(): TimeOption[] {
  const options: TimeOption[] = []

  for (let hour = 5; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const label = `${String(hour).padStart(2, '0')}:${minute === 0 ? '00' : '30'}`
      const value = `${label}:00`

      const group: TimeGroup =
        hour < 13 ? 'Manhã' : hour < 19 ? 'Tarde' : 'Noite'

      options.push({ label, value, group })
    }
  }

  return options
}
