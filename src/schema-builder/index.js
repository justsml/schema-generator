import { detectTypes } from './type-helpers.js'

export { schemaBuilder, condenseFieldData, condenseFieldSizes, getNumberRangeStats }

function schemaBuilder (name, data) {
  if (typeof name !== 'string') throw Error('Argument "name" must be a String')
  if (!Array.isArray(data)) throw Error('Input must be an Array!')

  const detectedSchema = { _uniques: {}, _totalRecords: 0 }
  return Promise.resolve(data)
    .then(docs => {
      return docs.reduce(evaluateSchemaLevel, detectedSchema)
    })
    .then(schema => condenseFieldData(schema._fieldData))
    .then(genSchema => {
      console.log('genSchema', genSchema)
      return genSchema
    })
}

function evaluateSchemaLevel (schema, row, index, array) { // eslint-disable-line
  schema = schema || {}
  schema._uniques = schema._uniques || {}
  schema._fieldData = schema._fieldData || {}
  schema._totalRecords =
    schema._totalRecords === undefined ? array.length : schema._totalRecords
  Object.keys(row).forEach(key => {
    const typeFingerprint = getFieldMetadata({
      schema,
      key: key,
      currentValue: row[key]
    })
    if (['Number', 'String'].includes(typeFingerprint)) {
      schema._uniques[key] = schema._uniques[key] || new Set()
      schema._uniques[key].add(row[key])
    }
    // schema._totalRecords += 1;
    schema._fieldData[key] = schema._fieldData[key] || []
    schema._fieldData[key].push(typeFingerprint)
  })
  return schema
}

function condenseFieldData(fields) {
  // const fields = schema._fieldData
  const fieldSummary = {}
  Object.keys(fields)
    .forEach((fieldName) => {
      fieldSummary[fieldName] = condenseFieldSizes(fields[fieldName])
    })
  return fieldSummary
}
function condenseFieldSizes(typeSizesList) {
  // const blankTypeSums = () => ({ length: 0, scale: 0, precision: 0 })
  const sumCounts = {}
  typeSizesList.map(currentTypeGuesses => {

    const typeSizes = Object.entries(currentTypeGuesses)
    .map(([typeName, { length, scale, precision }]) => {
      // console.log(typeName, JSON.stringify({ length, scale, precision }))
      sumCounts[typeName] = sumCounts[typeName] || {}
      if (!sumCounts[typeName].count) sumCounts[typeName].count = 0
      if (Number.isFinite(length) && !sumCounts[typeName].length) sumCounts[typeName].length = []
      if (Number.isFinite(scale) && !sumCounts[typeName].scale) sumCounts[typeName].scale = []
      if (Number.isFinite(precision) && !sumCounts[typeName].precision) sumCounts[typeName].precision = []

      sumCounts[typeName].count ++
      if (length) sumCounts[typeName].length.push(length)
      if (scale) sumCounts[typeName].scale.push(scale)
      if (precision) sumCounts[typeName].precision.push(precision)
      return sumCounts[typeName]
    })
  })
  /*
  > Example of sumCounts at this point
  {
    Float: { count: 4, scale: [ 5, 5, 5, 5 ], precision: [ 2, 2, 2, 2 ] },
    String: { count: 3, length: [ 2, 3, 6 ] },
    Number: { count: 1, length: [ 6 ] }
  }
  */
  const sizeRangeSummary = {}
  Object.entries(sumCounts)
    .map(([typeName, { count, length, precision, scale }]) => {
      if (!sizeRangeSummary[typeName]) sizeRangeSummary[typeName] = {}
      if (sumCounts[typeName].length) sizeRangeSummary[typeName].length = getNumberRangeStats(sumCounts[typeName].length)
      if (sumCounts[typeName].scale) sizeRangeSummary[typeName].scale = getNumberRangeStats(sumCounts[typeName].scale)
      if (sumCounts[typeName].precision) sizeRangeSummary[typeName].precision = getNumberRangeStats(sumCounts[typeName].precision)
      if (sumCounts[typeName].count) sizeRangeSummary[typeName].count = sumCounts[typeName].count
    })
  /*
  > Example of sizeRangeSummary at this point
  {
    Float: {
      scale: { min: 5, avg: 5, max: 5, pct30: 5, pct60: 5, pct90: 5 },
      precision: { min: 2, avg: 2, max: 2, pct30: 2, pct60: 2, pct90: 2 },
      count: 4
    },
    String: {
      length: { min: 2, avg: 3.6666666666666665, max: 6, pct30: 2, pct60: 3, pct90: 6 },
      count: 3
    },
    Number: {
      length: { min: 6, avg: 6, max: 6, pct30: 6, pct60: 6, pct90: 6 },
      count: 1
    }
  }
  */
  //  console.log('typeSizes SUM:', sumCounts)
  // console.log(sizeRangeSummary)
  return sizeRangeSummary
}



// function condenseFieldData (schema) {
//   console.log('schema', schema)
//   const fields = Object.keys(schema._fieldData)
//   // Summarize field/column data so only minimal field metadata is sent along to the Writer Adapters.
//   schema._summary = fields.map(fieldName => {
//     const fieldSummaryArray = schema._fieldData[fieldName]
//     // Get min & max bytes seen for string fields, and min & max range for numeric fields.
//     const getFieldRangeByName = sizeField =>
//       getNumberRangeStats(
//         fieldSummaryArray
//           .map(f => f[sizeField])
//           .sort()
//           .filter(f => f != null)
//       )
//     const fieldLengths = getFieldRangeByName('length')
//     // Get size info for floating point fields
//     const fieldPrecisions = getFieldRangeByName('precision')
//     const fieldScales = getFieldRangeByName('scale')

//     // Count up each type's # of occurences
//     const fieldTypesFound = fieldSummaryArray.reduce((counts, field) => {
//       const name = field.typeGuess
//       counts[name] = counts[name] || 0
//       counts[name]++
//       return counts
//     }, {})
//     // Get top type by sortting the types. We'll pass along all the type counts to the writer adapter.
//     const typeRank = Object.entries(fieldTypesFound).sort(
//       ([n1, count1], [n2, count2]) =>
//         count1 > count2 ? -1 : count1 === count2 ? 0 : 1
//     )
//     return {
//       fieldName,
//       typeInfo: fieldTypesFound,
//       typeRank,
//       sizeInfo: {
//         ...fieldLengths,
//         precision: fieldPrecisions,
//         scale: fieldScales
//       }
//     }
//   })
//   return schema
// }







// function guessTypeSimple({ currentType, currentValue }) {
//   if (currentValue == null || currentValue === "") {
//     return TYPE_DEFAULT;
//   } else if (typeof currentValue === "boolean") {
//     return TYPE_BOOLEAN;
//   } else if (typeof currentValue === "number") {
//     return TYPE_NUMBER;
//   } else if (isDateString(currentValue) || isDate(currentValue)) {
//     return TYPE_DATE;
//   } else if (typeof currentValue === "string") {
//     // double check if it's really number-ish
//     if (/^[\d.,]+$/.test(currentValue)) {
//       return TYPE_NUMBER;
//     }
//     return TYPE_STRING;
//   } else if (Array.isArray(currentValue)) {
//     return TYPE_ARRAY;
//   } else if (typeof currentValue === "object") {
//     return TYPE_OBJECT;
//   } else if (typeof currentValue === "string") {
//     return TYPE_STRING;
//   }
// }

function getFieldMetadata ({
  currentValue,
  key,
  schema, // eslint-disable-line
  recursive = false
}) {
  const typeGuesses = detectTypes(currentValue, key)

  const typeAnalysis = typeGuesses.reduce((analysis, typeGuess, rank) => {
    let length
    let precision
    let scale

    analysis[typeGuess] = { rank: rank + 1 }

    if (typeGuess === 'Float') {
      length = parseFloat(currentValue)
      const significandAndMantissa = String(currentValue).split('.')
      if (significandAndMantissa.length === 2) {
        // floating point number!
        precision = significandAndMantissa.join('').length // total # of numeric positions before & after decimal
        scale = significandAndMantissa[1].length
        analysis[typeGuess] = { ...analysis[typeGuess], precision, scale }
      }
    }
    if (typeGuess === 'String') {
      length = String(currentValue).length
      analysis[typeGuess] = { ...analysis[typeGuess], length }
    }
    if (typeGuess === 'Array') {
      length = currentValue.length
      analysis[typeGuess] = { ...analysis[typeGuess], length }
    }
    // console.log(`Guessed type for ${key}=${typeGuess}`);
    if (typeGuess === 'Object' && Object.keys(currentValue).length >= 2) {
      if (recursive) throw new Error('Feature not supported yet!')
      //    return evaluateSchemaLevel(schema[key], currentValue)
      // length = Object.keys(currentValue)
    }
    return analysis
  }, {});

  return typeAnalysis
  // return { typeGuesses, length, precision, scale }
  // if (priority.indexOf(typeGuess) >= priority.indexOf(currentType)) {
  //   return typeGuess;
  // } else {
  //   return currentType;
  // }
}

function getNumberRangeStats (numbers) {
  if (!numbers || numbers.length < 1) return undefined
  numbers = numbers.slice().sort((a, b) => a < b ? -1 : a === b ? 0 : 1);
  const sum = numbers.reduce((a, b) => a + b, 0)
  return {
    min: numbers[0],
    avg: sum / numbers.length,
    max: numbers[numbers.length - 1],
    pct30: numbers[parseInt((numbers.length * 0.3), 10)],
    pct60: numbers[parseInt((numbers.length * 0.6), 10)],
    pct90: numbers[parseInt((numbers.length * 0.9), 10)]
  }
}