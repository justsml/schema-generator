import isDate from 'lodash.isdate'
// import isNumber from 'lodash.isnumber'
import { isObjectId, isUuid, isDateString, isNumeric } from './utils/type-detectors.js'

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
  check: value => !!value && isObjectId(value)
}
const TYPE_UUID = {
  type: 'UUID',
  check: value => !!value && isUuid(value)
}
const TYPE_BOOLEAN = {
  type: 'Boolean',
  check: value => !!value && (typeof value === 'boolean' || /^([YN]|(TRUE)|(FALSE))$/i.test(String(value)))
}
const TYPE_DATE = {
  type: 'Date', check: value => isDateString(value) || isDate(value)
}
const TYPE_TIMESTAMP = {
  type: 'Timestamp', check: value => /^[12]\d{12}$/.test(value)
}
const TYPE_CURRENCY = {
  type: 'Currency',
  check: value => {
    if (value !== null) {
      return /^\p{Sc}\s?[\d,.]+$/uig.test(value) || /^[\d,.]+\s?\p{Sc}$/uig.test(value)
    }
  }
}
const TYPE_FLOAT = {
  type: 'Float',
  check: value => {
    if (value !== null) {
      return isNumeric(String(value)) && !Number.isInteger(value) ? true : false
    }
  }
}
const TYPE_NUMBER = {
  type: 'Number',
  check: value => {
    return !!(value !== null && (Number.isInteger(value) || isNumeric(value)))
  }
}
const TYPE_EMAIL = {
  type: 'Email',
  check: value => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/igm.test(value)
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
const TYPE_NULL = { type: 'null', check: value => value === null || /null/i.test(value) }

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
