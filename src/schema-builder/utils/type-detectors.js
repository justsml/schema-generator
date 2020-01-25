export { isObjectId, isDateString, isNumeric }

function isObjectId (str, fieldName) {
  return /^[a-f\d]{24}$/i.test(str)
}

function isDateString (str, fieldName) {
  // not bullet-proof, meant to sniff intention in the data
  return /^\d{4}-\d{2}-\d{2}/.test(str)
}

function isNumeric (str, fieldName) {
  return /^[\d.,]+$/.test(str)
}
