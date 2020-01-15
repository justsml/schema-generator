import isDate from "lodash.isdate";
import isNumber from "lodash.isnumber";

export { schemaBuilder };

const MONGO_BOOLEAN_TYPE = { type: "Boolean", default: null };
const MONGO_NUMBER_TYPE = { type: "Number", default: null };
const MONGO_STRING_TYPE = { type: "String", default: null };
const MONGO_ENUM_TYPE = { type: "String", default: null, enum: [] };
const MONGO_ARRAY_TYPE = { type: "Array", default: null };
const MONGO_OBJECT_TYPE = { type: "Object", default: null };
const MONGO_DATE_TYPE = { type: "Date", default: null };
const MONGO_DEFAULT_TYPE = MONGO_BOOLEAN_TYPE;

function schemaBuilder(name, data) {
  if (typeof name !== "string") throw Error('Argument "name" must be a String');
  if (!Array.isArray(data)) throw Error('Argument "data" must be an Array!');

  var detectedSchema = { _uniques: {}, _totalRecords: 0 };
  return Promise.resolve(data)
    .then(docs => {
      return docs.reduce(evaluateSchemaLevel, detectedSchema);
    })
    .then(condenseSchemaLevel)
    .then(genSchema => {
      console.log("genSchema", genSchema);
      return genSchema;
    });
}

function evaluateSchemaLevel(schema, obj) {
  schema = schema || {};
  schema._uniques = schema._uniques || {};
  schema._totalRecords =
    schema._totalRecords === undefined ? 0 : schema._totalRecords;
  Object.keys(obj).forEach(key => {
    schema._uniques[key] = schema._uniques[key] || new Set();
    schema._uniques[key].add(obj[key]);
    schema._totalRecords += 1;
    schema[key] = checkUpgradeType({
      schema,
      currentType: schema[key],
      currentValue: obj[key],
      key: key
    });
  });
  return schema;
}

function condenseSchemaLevel(schema) {
  // cleanup the schema
  Object.keys(schema._uniques).map(k => {
    //TODO: Add null counter to prevent false-positive enum detections
    let setToEnumLimit = schema._totalRecords * 0.5; // 5% default
    if (
      ["number", "string"].indexOf(schema[k].type) > -1 &&
      schema._uniques[k].size <= setToEnumLimit
    ) {
      schema[k] = MONGO_ENUM_TYPE;
      schema[k].enum = Array.from(schema._uniques[k]).sort();
      console.log(`Enumified ${k}=${schema[k].enum.join(", ")}`);
    } else {
      schema._uniques[k] = null; //Array.from(schema._uniques[k]).sort().join(', '); //temp for debugging// set to null or remove later
    }
  });
  return schema;
}
const priority = [
  MONGO_BOOLEAN_TYPE,
  MONGO_NUMBER_TYPE,
  MONGO_STRING_TYPE,
  MONGO_ARRAY_TYPE,
  MONGO_OBJECT_TYPE,
  MONGO_DATE_TYPE,
  MONGO_ENUM_TYPE
];

function guessTypeSimple({ currentType, currentValue }) {
  if (currentValue === null || currentValue === "") {
    return currentType || MONGO_DEFAULT_TYPE;
  } else if (typeof currentValue === "boolean") {
    return MONGO_BOOLEAN_TYPE;
  } else if (typeof currentValue === "number") {
    return MONGO_NUMBER_TYPE;
  } else if (isDateString(currentValue) || isDate(currentValue)) {
    return MONGO_DATE_TYPE;
  } else if (typeof currentValue === "string") {
    // double check if it's really number-ish
    if (isNumber(currentValue).toString() === currentValue) {
      return MONGO_NUMBER_TYPE;
    }
    return MONGO_STRING_TYPE;
  } else if (Array.isArray(currentValue)) {
    return MONGO_ARRAY_TYPE;
  } else if (typeof currentValue === "object") {
    return MONGO_OBJECT_TYPE;
  } else if (typeof currentValue === "string") {
    return MONGO_STRING_TYPE;
  }
}

function isDateString(str) {
  // not bullet-proof, meant to sniff intention in the data
  return /^\d{4}-\d{2}-\d{2}/.test(str);
}

function checkUpgradeType({ currentType, currentValue, key, schema }) {
  var typeGuess = guessTypeSimple({ currentType, currentValue });
  // console.log(`Guessed type for ${key}=${typeGuess.type}`);
  if (
    typeof currentValue === "object" &&
    currentValue.toString() === "[object Object]" &&
    Object.keys(currentValue).length >= 2
  ) {
    return evaluateSchemaLevel(schema[key], currentValue);
  }
  if (priority.indexOf(typeGuess) >= priority.indexOf(currentType)) {
    return typeGuess;
  } else {
    return currentType;
  }
}
