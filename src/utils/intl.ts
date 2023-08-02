const dateFormatter = (options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'CET', ...options })

const numberFormatter = (options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('sv-SE', options)

export const formatDate = (date: string) =>
  dateFormatter().format(new Date(date))

export const formatTime = (date: string) =>
  dateFormatter({ timeStyle: 'short' }).format(new Date(date))

export const toYear = (date: string | Date) =>
  dateFormatter({ year: 'numeric' }).format(new Date(date))

export const toYearShort = (date: string | Date) =>
  dateFormatter({ year: '2-digit' }).format(new Date(date))

export const formatDateTime = (
  date: string,
  timeStyle: Intl.DateTimeFormatOptions['timeStyle'] = 'short'
) => dateFormatter({ dateStyle: 'short', timeStyle }).format(new Date(date))

export const parsePercent = (input: number) =>
  numberFormatter({ style: 'percent' }).format(input)
