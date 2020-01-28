import snakecase from 'lodash.snakecase'

const getFieldLengthArg = (fieldName, maxLength) => {
  if (maxLength > 4000) return ', 8000'
  if (maxLength > 2000) return ', 4000'
  if (maxLength > 1000) return ', 2000'
  if (maxLength > 800) return ', 1000'
  if (maxLength > 600) return ', 800'
  if (maxLength > 400) return ', 600'
  if (maxLength > 200) return ', 400'
  if (maxLength > 100) return ', 200'
  if (maxLength > 80) return ', 100'
  if (maxLength > 60) return ', 80'
  if (maxLength > 40) return ', 60'
  if (maxLength > 20) return ', 40'
  return ', 20'
}

const builderMethods = {
  unknown: { method: `text`, getOptions: () => [] },
  objectid: { method: `string`, getOptions: () => [] },
  uuid: { method: `uuid`, getOptions: () => [] },
  boolean: { method: `boolean`, getOptions: () => [] },
  date: { method: `datetime`, getOptions: () => [] },
  timestamp: { method: `timestamp`, getOptions: () => [] },
  currency: { method: `float`, getOptions: () => [] },
  float: { method: `float`, getOptions: () => [] },
  number: { method: `integer`, getOptions: (typeInfo) => [typeInfo.precision, typeInfo.scale] },
  email: { method: `string`, getOptions: () => [] },
  string: { method: `string`, getOptions: () => [] },
  array: { method: `json`, getOptions: () => [] },
  object: { method: `json`, getOptions: () => [] },
  null: {
    method: `text`, getOptions: (n, v) => {
      console.error(`WARNING: No Type Detected for Field ${n}! Assuming text column!`);
      return []
    }
  }
}

export default {
  render({ schemaName, results, options }) {
    const fieldSummary = results.fields
    const uniqueCounts = results.uniques

    function getColumnBuilderString(name, types, uniques) {
      types = types.slice(0)
        .filter(f => f[0] !== 'Null' && f[0] !== 'Unknown')
        .filter(f => f[0] !== 'Email')
        .sort((a, b) => a[1].count > b[1].count ? -1 : a[1].count === b[1].count ? 0 : 1)
      let [topType, topTypeStats] = types[0]
      console.log(`topTypeStats`, name, uniqueCounts[name], JSON.stringify(types))
      let { length, scale, precision, count } = topTypeStats
      topType = topType.toLowerCase()

      let appendChain = '';

      let sizePart = topType === 'string' && name !== 'id'
        ? getFieldLengthArg(name, length.percentiles[2])
        : ''
      if (topType === 'float' && precision && precision.max) {
        sizePart = `, ${1 + precision.max}, ${scale.max % 2 !== 0 ? scale.max + 1 : scale.max}`
      }
      if (name === 'id') appendChain = '.primary()'



      if (topType === `unknown`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `objectid`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `uuid`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `boolean`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `date`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `timestamp`) return `    table${builderMethods[topType].method}.`
      if (topType === `currency`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `float`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `number`) {
        return `    table.${length.max > 2147483647 ? 'bigInteger' : builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      }
      if (topType === `email`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `string`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `array`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `object`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`
      if (topType === `null`) return `    table.${builderMethods[topType].method}("${snakecase(name)}"${sizePart})${appendChain};`

      // let typeMethod =
      //   topType === 'id' && topType === 'number' ? 'serial' : topType

      console.log('FAILED TO MATCH!!!!', topType)
      console.log('FAILED TO MATCH!!!!', name)
      console.log('FAILED TO MATCH!!!!', sizePart, appendChain)
      return ` // oh noes, column not recognized`
    }
    // results._uniques = undefined;
    // results._totalRecords = undefined;
    /**
    salesScore: {
      "Float": {
        "scale": { "max": 7 ... },
        "precision": { "max": 9 ... },
        "count": 26
      },
      "Number": { "count": 26 }
    }
    */
    const fieldDefs = Object.entries(fieldSummary)
      .map(([fieldName, typeInfo]) => {
        /**
        [
          ["Float", {
          "scale": { "max": 7 ... },
          "precision": { "max": 9 ... },
          "count": 26
          }],
          [ "Number", { "count": 26 } ]
        ]
        */
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
