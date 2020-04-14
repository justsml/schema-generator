import readerCsv from './reader.csv.js'
import readerJson from './reader.json.js'

export const parse = content => {
  const readers = [readerJson, readerCsv]
  const reader = readers.find(r => r.shouldParse(content))
  const parsedData = reader && reader.parse(content)
  if (!parsedData) throw new Error('Could not parse input. Invalid JSON or CSV data.')
  return parsedData
}
