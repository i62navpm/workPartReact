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

    if (!payEvents) payEvents = {}
    if (!debtEvents) debtEvents = {}
    return [
      rest.name,
      payEvents.money || 0,
      debtEvents.money || 0,
      parseWorks(payEvents.works || [])
    ]
  })
}

function parseWorks(works = []) {
  return works.join(', ')
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
    ['', 0, 0]
  )
}

export function getFirstDayMonth(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month, 1).toISOString()
}
