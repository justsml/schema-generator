export { isObjectId, isUuid, isDateString, isNumeric }

function isUuid (str, fieldName) {
  return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(str)
}
function isObjectId (str, fieldName) {
  return /^[a-f\d]{24}$/i.test(str)
}

function isDateString (str, fieldName) {
  // not bullet-proof, meant to sniff intention in the data
  return /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(str)
}

function isNumeric (str, fieldName) {
  return /^-?[\d.,]+$/.test(str)
}
