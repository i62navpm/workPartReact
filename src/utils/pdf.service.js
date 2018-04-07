import { DateTime } from 'luxon'

export function createTables(doc, employee) {
  return {
    createMainTable(rows, columns, date) {
      doc.setTextColor('#3f51b5')
      doc.text(employee.name, 15, 15)
      doc.setFontSize(18)
      doc.text(
        `Paysheet ${DateTime.fromISO(
          new Date(date).toISOString()
        ).toLocaleString({ month: 'long', year: 'numeric' })}`,
        115,
        25
      )
      doc.setFontSize(10)
      doc.setTextColor()
      doc.text(`Nif: ${employee.nif}`, 15, 20)
      doc.text(`Address: ${employee.address}`, 15, 25)
      doc.text(`Phone: ${employee.phone}`, 15, 30)
      doc.text(`Email: ${employee.email}`, 15, 35)
      doc.setFontSize(16)

      doc.autoTable(columns, rows, {
        theme: 'striped',
        startY: 40,
        bodyStyles: { fontSize: 8 },
        margin: { horizontal: 30 },
        columnStyles: {
          1: { columnWidth: 20 },
          2: { columnWidth: 20 },
          3: { overflow: 'linebreak' }
        },
        drawCell: (cell, data) => {
          if (data.row.index === data.table.rows.length - 1) {
            doc.setFontSize(12)
            doc.setFontStyle('bold')
          }
        },
        drawRow: function(row, data) {
          if (row.index === data.table.rows.length - 1) {
            const title = row.cells['0']
            const totalPay = row.cells['1']
            const totalDebt = row.cells['2']

            data.row.height = 8
            title.styles.halign = 'right'
            totalPay.styles.textColor = '#4caf50'
            totalDebt.styles.textColor = '#e91e63'
          }
        }
      })
    },
    createTotalTable(totalAdd) {
      const options = {
        theme: 'grid',
        startY: doc.autoTableEndPosY(),
        bodyStyles: { fontSize: 10 },
        margin: { horizontal: 80 },
        drawCell: (cell, data) => {
          if (data.row.index === data.table.rows.length - 1) {
            doc.setFontSize(12)
            doc.setFontStyle('bold')
          }
        },
        drawRow: function(row, data) {
          if (row.index === data.table.rows.length - 1) {
            const title = row.cells['0']

            data.row.height = 8
            title.styles.halign = 'center'
            title.styles.textColor = title.raw.includes('-')
              ? '#e91e63'
              : '#4caf50'
          }
        }
      }

      const [, totalPay, totalDebt] = totalAdd
      const total = [`${totalPay - totalDebt} €`]
      doc.autoTable(['Total'], [total], options)
    }
  }
}
