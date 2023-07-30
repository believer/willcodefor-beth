const dateFormatter = (options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'CET', ...options })

export const formatDate = (date: string) =>
  dateFormatter().format(new Date(date))

export const formatTime = (date: string) =>
  dateFormatter({ timeStyle: 'short' }).format(new Date(date))

export const toYear = (date: string | Date) =>
  dateFormatter({ year: 'numeric' }).format(new Date(date))

export const toYearShort = (date: string | Date) =>
  dateFormatter({ year: '2-digit' }).format(new Date(date))

export const formatDateTime = (date: string) =>
  dateFormatter({ dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(date)
  )
