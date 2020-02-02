import snakecase from 'lodash.snakecase'
import debug from 'debug'
const log = debug('writer:knex')

const BIG_INTEGER_MIN = 2147483647
const ENUM_DETECTION_ROW_MINIMUM = 100

const getFieldLengthArg = (fieldName, maxLength) => {
  if (maxLength > 4000) return 8000
  if (maxLength > 2000) return 4000
  if (maxLength > 1000) return 2000
  if (maxLength > 800) return 1000
  if (maxLength > 600) return 800
  if (maxLength > 400) return 600
  if (maxLength > 200) return 400
  if (maxLength > 100) return 200
  if (maxLength > 80) return 100
  if (maxLength > 60) return 80
  if (maxLength > 40) return 60
  if (maxLength > 20) return 40
  return 20
}

/**

Determine a "best guess" maximum field size, use the 90th percentile when
the distance between it and the maximum exceeds 30 percent (of the max value)

@example

Situation: A `City` field normally has a size range of 3-15 characters.
A glitch at our vendor swapped `City` with a huge text field in 1 record!

We don't want to set the limit way bigger than
necessary, as it'd be confusing and impact performance.

Reduced example - `very sparse` data: [3, 4, 5, 7, 9, 231429]
*/
const correctForErroneousMaximum = (threshold = 0.30, ninetiethPct, maximum) => {
  const gapLimit = threshold * maximum
  const topTenPercentileRange = maximum - ninetiethPct
  if (topTenPercentileRange > gapLimit) {
    log('Correcting for erroneous maximum field value:', { ninetiethPct, maximum })
    return ninetiethPct
  }
  return maximum
}

/**
 * @returns TypeMetadata
 *
 * > Type details: https://github.com/justsml/schema-analyzer#data-analysis-results
 *
 * "String": {
 *   "count": 5,
 *   "length": {
 *     "min": 3,"avg": 7.2,"max": 15,
 *     "percentiles": [ 3, 10, 15 ]
 *   },
 *   "rank": 12
 * }
 */
const getMetadataByTypeName = (typeName, types) => {
  return types.find(field => field[0].toLowerCase() === typeName.toLowerCase())
}

export default {
  render ({
    schemaName, results,
    options = {
      detectEnumLimit: 20,
      bogusSizeThreshold: 0.25,
      notNullThreshold: 0.01,
      convertMongoIds: true
    }
  }) {
    const {
      detectEnumLimit,
      bogusSizeThreshold
      // notNullThreshold,
      // convertMongoIds = true
    } = options || {}
    const fieldSummary = results.fields
    const uniqueCounts = results.uniques
    const rowCount = results.rowCount

    function getColumnBuilderString (name, types, uniques) {
      const dbName = snakecase(name)
      const nullTypeInfo = getMetadataByTypeName('Null', types)

      types = types.slice(0)
        .filter(f => f[0] !== 'Null' && f[0] !== 'Unknown')
        .sort((a, b) => a[1].count > b[1].count ? -1 : a[1].count === b[1].count ? 0 : 1)
      let [topType, topTypeStats] = types[0]
      const { length, scale, precision, value, count: typeCount } = topTypeStats
      topType = topType.toLowerCase()
      const uniqueness = rowCount / uniques.length
      // TODO: calculate entropy using a sum of all non-null detected types, not just typeCount
      const entropy = rowCount / typeCount
      const nullCount = nullTypeInfo && nullTypeInfo.count
      console.log('typeStats', name, uniqueCounts[name], { uniqueness, entropy, nullCount }, JSON.stringify(types))

      let appendChain = ''

      let sizePart = topType === 'string'
        ? getFieldLengthArg(name, correctForErroneousMaximum(bogusSizeThreshold, length.percentiles[2], length.max))
        : ''

      if (topType === 'string' || topType === 'number') {
        log(`ENUM: Detection haz rows? RowCount=${rowCount} > ENUM_ROW_MIN=${ENUM_DETECTION_ROW_MINIMUM}`, name)
        log(`ENUM: Uniques Count: uniques.length=${uniques.length} detectEnumLimit=${detectEnumLimit} `, name)
        if (rowCount > ENUM_DETECTION_ROW_MINIMUM && uniques.length <= detectEnumLimit) {
          console.info(`ENUM Detected: ${name} (${uniques.length}) \n TODO: Get/add unique values from the SchemaAnalyzer`)
        }
      }
      if (topType === 'float' && precision && precision.max) {
        const p = precision.max
        const s = scale.max
        sizePart = `, ${1 + p}, ${s % 2 !== 0 ? s + 1 : s}`
        return `    table.decimal("${dbName}"${sizePart})${appendChain};`
      }
      if (name.toLowerCase() === 'id' && topType === 'number') {
        if (value.max > BIG_INTEGER_MIN) {
          return `    table.bigIncrements("${dbName}");`
        } else {
          return `    table.increments("${dbName}");`
        }
      }
      if (name === 'id') appendChain = '.primary()'

      if (uniqueness >= 1 && (topType === 'objectid' || topType === 'uuid' ||
            topType === 'email' || topType === 'string' || topType === 'number')) { // rows have unique values for field
        appendChain = '.unique()'
      }
      if (entropy >= 0.999) { // likely a not-null type of field
        appendChain = '.notNull()'
      }

      if (topType === 'unknown') return `    table.text("${dbName}"${sizePart})${appendChain};`
      if (topType === 'objectid') return `    table.string("${dbName}", 24);`
      if (topType === 'uuid') return `    table.uuid("${dbName}"${sizePart})${appendChain};`
      if (topType === 'boolean') return `    table.boolean("${dbName}"${sizePart})${appendChain};`
      if (topType === 'date') return `    table.datetime("${dbName}"${sizePart})${appendChain};`
      if (topType === 'timestamp') return `    table.timestamp("${dbName}"${sizePart})`
      if (topType === 'currency') return `    table.float("${dbName}"${sizePart});`
      if (topType === 'float') return `    table.float("${dbName}"${sizePart});`
      if (topType === 'number') { return `    table.${length.max > BIG_INTEGER_MIN ? 'bigInteger' : 'integer'}("${dbName}")${appendChain};` }
      if (topType === 'email') return `    table.string("${dbName}"${sizePart})${appendChain};`
      if (topType === 'string') return `    table.string("${dbName}"${sizePart})${appendChain};`
      if (topType === 'array') return `    table.json("${dbName}"${sizePart})${appendChain};`
      if (topType === 'object') return `    table.json("${dbName}"${sizePart})${appendChain};`
      if (topType === 'null') return `    table.text("${dbName}")${appendChain};`
    }
    const fieldDefs = Object.entries(fieldSummary)
      .map(([fieldName, typeInfo]) => {
        typeInfo = Object.entries(typeInfo)
        return getColumnBuilderString(fieldName, typeInfo, results.uniques[fieldName])
      })
      .join('\n')

    const tableName = snakecase(schemaName)
    return `// More info: http://knexjs.org/#Schema-createTable

exports.up = function up(knex) {
  return knex.schema.createTable("${tableName}", (table) => {
${fieldDefs.replace(/\\n/gms, '\n')}
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists("${tableName}");
};

`
  }
}

/*
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id')
      table.string('name', 256)
      table.integer('age')
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
};
*/
