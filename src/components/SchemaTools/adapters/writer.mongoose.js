import camelcase from 'lodash.camelcase'
import capitalize from 'lodash.capitalize'
import { getFieldLengthArg, correctForErroneousMaximum } from './common.js'
import debug from 'debug'
const log = debug('writer:mongoose')

export default {
  render ({ schemaName, results, options }) {
    console.log(results)
    let enumDesc = ''

    const {
      bogusSizeThreshold = 0.1,
      defaultColumnFormatter = (name, fieldInfo, nullable = true) =>
        `    ${name}${nullable ? '?' : ''}: string${
          nullable ? ' | null' : ''
        }; // fallback for missing columns`
    } = options || {}

    const fieldSummary = results.fields
    // const uniqueCounts = results.uniques
    // const rowCount = results.rowCount

    const fieldString = Object.entries(fieldSummary)
      .map((fieldNameAndInfo) => {
        const [fieldName, fieldInfo] = fieldNameAndInfo
        const name = camelcase(fieldName)
        if (
          fieldInfo &&
          fieldInfo.types &&
          Object.keys(fieldInfo.types).length === 0
        ) {
          return defaultColumnFormatter(fieldName, fieldInfo, true)
        }
        let { types } = fieldInfo
        types = Array.isArray(types) ? types : Object.entries(types)
        types = types
          .slice(0)
          .filter((f) => f[0] !== 'Null' && f[0] !== 'Unknown')
          .sort((a, b) =>
            a[1].count > b[1].count ? -1 : a[1].count === b[1].count ? 0 : 1
          )

        if (types.length === 0) { return defaultColumnFormatter(fieldName, fieldInfo, true) }

        let [topType, topTypeStats] = types[0]
        topType = topType.toLowerCase()
        const {
          length,
          scale,
          precision,
          value,
          unique,
          nullable,
          enum: enumData,
          count: typeCount
        } = topTypeStats

        if (topType === 'uuid') topType = 'ObjectId'
        if (
          (topType === 'string' || topType === 'number') &&
          enumData &&
          enumData.length > 0
        ) {
          // console.info(`ENUM Detected: ${name} (${uniques.length}) \n TODO: Get/add unique values from the SchemaAnalyzer`)
          enumDesc = `enum: ['${enumData.join("', '")}']`
        } else {
          enumDesc = null
        }
        const nullDesc = !nullable ? 'required: true' : null
        const typeDesc = `type: ${capitalize(topType)}`
        const sizeDesc = topType === 'string' && length
          ? `maxlength: ${getFieldLengthArg(name, correctForErroneousMaximum(bogusSizeThreshold, length.p99, length.max))}`
          : ''

        const fieldOptions = [typeDesc, enumDesc, nullDesc]
          .filter(Boolean)
          .join(',\n    ')

        return `  ${camelcase(fieldName)}: {
    ${fieldOptions}
  }`
      })
      .join(',\n')

    return `const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
${fieldString.replace(/\\n/gms, '\n')}
});

const model = mongoose.model("${capitalize(schemaName)}", schema);

module.exports = model;
`
  }
}
