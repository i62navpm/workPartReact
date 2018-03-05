import { DateTime } from 'luxon'

export function calcChart(data, date = new Date()) {
  let daysMonth = daysInMonth(date)
  const format = { month: 'numeric', day: 'numeric', year: 'numeric' }

  return daysMonth.map(({ date, ...rest }) => {
    let payEvents = data.pay.find(({ start }) => {
      start = DateTime.fromISO(new Date(start).toISOString())
      return start.toLocaleString(format) === date.toLocaleString(format)
    })

    let debtEvents = data.debt.find(({ start }) => {
      start = DateTime.fromISO(new Date(start).toISOString())
      return start.toLocaleString(format) === date.toLocaleString(format)
    })

    if (!payEvents) payEvents = { data: {} }
    if (!debtEvents) debtEvents = { data: {} }
    return [rest.name, payEvents.data.money || 0, debtEvents.data.money || 0]
  })
}

export function daysInMonth(date) {
  date = DateTime.fromISO(new Date(date).toISOString())
  let monthDate = date.startOf('month')

  return Array(monthDate.daysInMonth)
    .fill()
    .map((_, i) => ({
      name: monthDate.plus({ days: i }).toLocaleString(DateTime.DATE_HUGE),
      date: monthDate.plus({ days: i })
    }))
}

export function calcTotalRow(rows) {
  return rows.reduce(
    (bef, curr) => {
      const [title, pay1, debt1] = bef
      const [, pay2, debt2] = curr
      return [title, pay1 + pay2, debt1 + debt2]
    },
    ['Sum:   ', 0, 0]
  )
}
