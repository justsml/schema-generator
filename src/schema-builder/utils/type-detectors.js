import isDate from 'lodash.isdate'
export {
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
}

const currencies = [
  `$`, `¢`, `£`, `¤`, `¥`, `֏`, `؋`, `߾`, `߿`, `৲`, `৳`, `৻`,
  `૱`, `௹`, `฿`, `៛`, `₠`, `₡`, `₢`, `₣`, `₤`, `₥`, `₦`, `₧`,
  `₨`, `₩`, `₪`, `₫`, `€`, `₭`, `₮`, `₯`, `₰`, `₱`, `₲`, `₳`,
  `₴`, `₵`, `₶`, `₷`, `₸`, `₹`, `₺`, `₻`, `₼`, `₽`, `₾`, `₿`,
  `꠸`, `﷼`, `﹩`, `＄`, `￠`, `￡`, `￥`, `￦`,
  `𑿝`, `𑿞`, `𑿟`, `𑿠`, `𞋿`, `𞲰`
]

const boolishPattern = /^([YN]|(TRUE)|(FALSE))$/i
const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
const objectIdPattern = /^[a-f\d]{24}$/i
const dateStringPattern = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
const timestampPattern = /^[12]\d{12}$/
const currencyPatternUS = /^\p{Sc}\s?[\d,.]+$/uig
const currencyPatternEU = /^[\d,.]+\s?\p{Sc}$/uig
const numberishPattern = /^-?[\d.,]+$/
const floatPattern = /\d\.\d/
// const emailPattern = /^[^@]+@[^@]{2,}\.[^@]{2,}[^.]$/
const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/igm
const nullishPattern = /null/i
// const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/igm

function isBoolish (value, fieldName) {
  if (value == null) return false
  value = String(value).trim()
  return value.length <= 6 && boolishPattern.test(String(value))
}

function isUuid (value, fieldName) {
  if (value == null) return false
  value = String(value).trim()
  return value.length < 40 && uuidPattern.test(value)
}
function isObjectId (value, fieldName) {
  if (value == null) return false
  value = String(value).trim()
  return value.length < 40 && objectIdPattern.test(value)
}

function isDateString (value, fieldName) {
  // not bullet-proof, meant to sniff intention in the data
  if (value == null) return false
  if (isDate(value)) return true
  value = String(value).trim()
  return value.length < 30 && dateStringPattern.test(value)
}

function isTimestamp(value) {
  if (value == null) return false
  value = String(value).trim()
  return timestampPattern.test(value)
}

function isCurrency(value) {
  if (value == null) return false
  value = String(value).trim()
  const valueSymbol = currencies.find(curSymbol => value.indexOf(curSymbol) > -1)
  if (!valueSymbol) return false
  value = value.replace(valueSymbol, ``)
  return isNumeric(value)
  // console.log(value, 'currencyPatternUS', currencyPatternUS.test(value), 'currencyPatternEU', currencyPatternEU.test(value));
  // return currencyPatternUS.test(value) || currencyPatternEU.test(value)
}

function isNumeric (value, fieldName) {
  if (value == null) return false
  value = String(value).trim()
  return value.length < 30 && numberishPattern.test(value)
}

function isFloatish (value) {
  return !!(isNumeric(String(value)) && floatPattern.test(String(value)) && !Number.isInteger(value))
}

function isEmailShaped(value) {
  if (value == null) return false
  value = String(value).trim()
  return value.length < 80 && emailPattern.test(value)
}

function isNullish (value) {
  return value === null || nullishPattern.test(String(value).trim())
}
