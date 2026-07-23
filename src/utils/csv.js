const escapeCsvValue = (value) => {
  const text = value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

export const foodEntriesToCsv = (entries) => {
  const rows = [
    ['Datetime', 'Food', 'Calories', 'Protein (g)'],
    ...entries.map((entry) => [
      entry.datetime,
      entry.food,
      entry.calories,
      entry.protein,
    ]),
  ]

  return rows
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n')
}
