import {
  isBoolish,
  isCurrency,
  isDateString,
  isEmailShaped,
  isFloatish,
  isNullish,
  isNumeric,
  isObjectId,
  isTimestamp,
  isUuid
} from './utils/type-detectors.js'

function detectTypes (value) {
  return priority.reduce((types, typeHelper) => {
    if (typeHelper.check(value)) types.push(typeHelper.type)
    return types
  }, [])
}

// Basic Type Filters - rudimentary data sniffing used to tally up "votes" for a given field
/**
 * Detect ambiguous field type.
 * Will not affect weighted field analysis.
 */
const TYPE_UNKNOWN = {
  type: 'Unknown',
  check: value => value === '' || value === undefined || value === 'undefined'
}
const TYPE_OBJECT_ID = {
  type: 'ObjectId',
  check: isObjectId
}
const TYPE_UUID = {
  type: 'UUID',
  check: isUuid
}
const TYPE_BOOLEAN = {
  type: 'Boolean',
  check: isBoolish
}
const TYPE_DATE = {
  type: 'Date',
  check: isDateString
}
const TYPE_TIMESTAMP = {
  type: 'Timestamp',
  check: isTimestamp
}
const TYPE_CURRENCY = {
  type: 'Currency',
  check: isCurrency
}
const TYPE_FLOAT = {
  type: 'Float',
  check: isFloatish
}
const TYPE_NUMBER = {
  type: 'Number',
  check: value => {
    return !!(value !== null && !Array.isArray(value) && (Number.isInteger(value) || isNumeric(value)))
  }
}
const TYPE_EMAIL = {
  type: 'Email',
  check: isEmailShaped
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
    return !Array.isArray(value) && value != null && typeof value === 'object'
  }
}
const TYPE_NULL = {
  type: 'Null',
  check: isNullish
}

const priority = [
  TYPE_UNKNOWN,
  TYPE_OBJECT_ID,
  TYPE_UUID,
  TYPE_BOOLEAN,
  TYPE_DATE,
  TYPE_TIMESTAMP,
  TYPE_CURRENCY,
  TYPE_FLOAT,
  TYPE_NUMBER,
  TYPE_NULL,
  TYPE_EMAIL,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_OBJECT
]

export {
  priority,
  detectTypes,
  TYPE_UNKNOWN,
  TYPE_OBJECT_ID,
  TYPE_UUID,
  TYPE_BOOLEAN,
  TYPE_DATE,
  TYPE_TIMESTAMP,
  TYPE_CURRENCY,
  TYPE_FLOAT,
  TYPE_NUMBER,
  TYPE_NULL,
  TYPE_EMAIL,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_OBJECT
}
// const TYPE_ENUM = {
//   type: "String",
//   check: (value, fieldInfo, schemaInfo) => {
//     // Threshold set to 5% - 5 (or fewer) out of 100 unique strings should enable 'enum' mode
//     if (schemaInfo.inputRowCount < 100) return false; // disabled if set too small
//   }
// };
