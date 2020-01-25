import isDate from 'lodash.isdate'
import isNumber from 'lodash.isnumber'
import { isObjectId, isDateString, isNumeric } from './utils/type-detectors.js'

// Basic Type Filters - rudimentary data sniffing used to tally up "votes" for a given field
const TYPE_UNKNOWN = {
  type: 'Unknown',
  check: value => value === '' || value === undefined || value === 'undefined'
}
const TYPE_OBJECT_ID = {
  type: 'ObjectId',
  check: value => !!value && isObjectId(value)
}
const TYPE_UUID = {
  type: 'UUID',
  check: value =>
    !!value && /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value)
}
const TYPE_BOOLEAN = {
  type: 'Boolean',
  check: value => !!value && /^([YN]|(TRUE)|(FALSE))$/i.test(String(value))
}
const TYPE_CURRENCY = {
  type: 'Currency',
  check: value => {
    if (value !== null) {
      /^\p{Sc}\s?[\d,.]+$/.test(value)
    }
  }
}
const TYPE_FLOAT = {
  type: 'Float',
  check: value => {
    if (value !== null) {
      if (isNumeric(value) && isNumber(value) && !Number.isInteger(value)) return true
    }
  }
}
const TYPE_NUMBER = {
  type: 'Number',
  check: value => {
    return !!(value !== null && (/^\d+$/.test(value) && Number.isInteger(value)))
  }
}
const TYPE_STRING = {
  type: 'String',
  check: value => typeof value === 'string' && value.length >= 1
}
const TYPE_ARRAY = {
  type: 'Array',
  check: value => {
    return Array.isArray(value)
  }
}
const TYPE_OBJECT = {
  type: 'Object',
  check: value => {
    return !Array.isArray(value) && typeof value === 'object'
  }
}
const TYPE_DATE = {
  type: 'Date', check: value => isDateString(value) || isDate(value)
}
const TYPE_NULL = { type: 'null', check: value => value === null || /null/i.test(value) }

const priority = [
  TYPE_UNKNOWN,
  TYPE_OBJECT_ID,
  TYPE_UUID,
  TYPE_BOOLEAN,
  TYPE_DATE,
  TYPE_CURRENCY,
  TYPE_FLOAT,
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_OBJECT,
  TYPE_NULL
]

export { priority,
  TYPE_UNKNOWN,
  TYPE_OBJECT_ID,
  TYPE_UUID,
  TYPE_BOOLEAN,
  TYPE_CURRENCY,
  TYPE_FLOAT,
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_OBJECT,
  TYPE_DATE,
  TYPE_NULL
}
// const TYPE_ENUM = {
//   type: "String",
//   check: (value, fieldInfo, schemaInfo) => {
//     // Threshold set to 5% - 5 (or fewer) out of 100 unique strings should enable 'enum' mode
//     if (schemaInfo.inputRowCount < 100) return false; // disabled if set too small
//   }
// };
