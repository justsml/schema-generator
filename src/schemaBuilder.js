import isDate from "lodash.isdate";

export { schemaBuilder };

// const DATA_OBJECT_ID_TYPE = { type: "ObjectId", default: null };
const DATA_BOOLEAN_TYPE = { type: "Boolean", default: null };
const DATA_NUMBER_TYPE = { type: "Number", default: null };
const DATA_STRING_TYPE = { type: "String", default: null };
const DATA_ENUM_TYPE = { type: "String", default: null, enum: [] };
const DATA_ARRAY_TYPE = { type: "Array", default: null };
const DATA_OBJECT_TYPE = { type: "Object", default: null };
const DATA_DATE_TYPE = { type: "Date", default: null };
const DATA_DEFAULT_TYPE = DATA_BOOLEAN_TYPE;

const priority = [
  DATA_BOOLEAN_TYPE,
  DATA_NUMBER_TYPE,
  DATA_STRING_TYPE,
  DATA_ARRAY_TYPE,
  DATA_OBJECT_TYPE,
  DATA_DATE_TYPE,
  DATA_ENUM_TYPE
];

function getTypeByName(typeString) {
  const matchedType = priority.find(t => t.type === typeString) || {};
  return { ...matchedType };
}

function schemaBuilder(name, data) {
  if (typeof name !== "string") throw Error('Argument "name" must be a String');
  if (!Array.isArray(data)) throw Error('Argument "data" must be an Array!');

  const detectedSchema = { _uniques: {}, _totalRecords: 0 };
  return Promise.resolve(data)
    .then(docs => {
      return docs.reduce(evaluateSchemaLevel, detectedSchema);
    })
    .then(condenseFieldData)
    .then(genSchema => {
      console.log("genSchema", genSchema);
      return genSchema;
    });
}

function evaluateSchemaLevel(schema, obj, index, array) {
  schema = schema || {};
  schema._uniques = schema._uniques || {};
  schema._fieldData = schema._fieldData || {};
  schema._totalRecords =
    schema._totalRecords === undefined ? array.length : schema._totalRecords;
  Object.keys(obj).forEach(key => {
    schema._uniques[key] = schema._uniques[key] || new Set();
    schema._uniques[key].add(obj[key]);
    // schema._totalRecords += 1;
    schema._fieldData[key] = schema._fieldData[key] || [];
    schema._fieldData[key].push(
      checkUpgradeType({
        schema,
        currentType: schema[key],
        currentValue: obj[key],
        key: key
      })
    );
  });
  return schema;
}

function condenseFieldData(schema) {
  console.log("schema", schema);
  const fields = Object.keys(schema._fieldData);
  schema._summary = fields.map(fieldName => {
    const fieldSummaryArray = schema._fieldData[fieldName];
    const fieldLengths = getFieldRangeInfo(
      fieldSummaryArray.map(f => f.length).sort()
    );
    const fieldTypesFound = fieldSummaryArray.reduce((counts, field) => {
      const typeName = field.typeGuess;
      counts[typeName] = counts[typeName] || 0;
      counts[typeName]++;
      return counts;
    }, {});

    return {
      fieldName,
      typeInfo: fieldTypesFound,
      sizeInfo: fieldLengths
    };
  });
  return schema;
  // cleanup the schema
  // Object.keys(schema._uniques).map(k => {
  //   //TODO: Add null counter to prevent false-positive enum detections
  //   let setToEnumLimit = 6; // schema._totalRecords * 0.5; // 5% default
  //   if (
  //     ["number", "string"].indexOf(schema[k].type) > -1 &&
  //     schema._uniques[k].size <= setToEnumLimit
  //   ) {
  //     schema[k] = DATA_ENUM_TYPE;
  //     schema[k].enum = Array.from(schema._uniques[k]).sort();
  //     console.log(`Enumified ${k}=${schema[k].enum.join(", ")}`);
  //   } else {
  //     schema._uniques[k] = null; //Array.from(schema._uniques[k]).sort().join(', '); //temp for debugging// set to null or remove later
  //   }
  // });
  // return schema;
}

function guessTypeSimple({ currentType, currentValue }) {
  if (currentValue === null || currentValue === "") {
    return currentType || DATA_DEFAULT_TYPE;
  } else if (typeof currentValue === "boolean") {
    return DATA_BOOLEAN_TYPE;
  } else if (typeof currentValue === "number") {
    return DATA_NUMBER_TYPE;
  } else if (isDateString(currentValue) || isDate(currentValue)) {
    return DATA_DATE_TYPE;
  } else if (typeof currentValue === "string") {
    // double check if it's really number-ish
    if (/^[\d.,]+$/.test(currentValue)) {
      return DATA_NUMBER_TYPE;
    }
    return DATA_STRING_TYPE;
  } else if (Array.isArray(currentValue)) {
    return DATA_ARRAY_TYPE;
  } else if (typeof currentValue === "object") {
    return DATA_OBJECT_TYPE;
  } else if (typeof currentValue === "string") {
    return DATA_STRING_TYPE;
  }
}

function isObjectId(str, fieldName) {
  return /^[a-f\d]{24}$/i.test(str);
}

function isDateString(str, fieldName) {
  // not bullet-proof, meant to sniff intention in the data
  return /^\d{4}-\d{2}-\d{2}/.test(str);
}

function checkUpgradeType({
  currentType,
  currentValue,
  key,
  schema,
  recursive = false
}) {
  const typeGuess = guessTypeSimple({ currentType, currentValue }).type;
  let length = null;

  if (typeGuess === "Number") length = parseFloat(currentValue);
  if (typeGuess === "String") length = String(currentValue).length;
  // console.log(`Guessed type for ${key}=${typeGuess}`);
  if (typeGuess === "Object" && Object.keys(currentValue).length >= 2) {
    if (recursive) return evaluateSchemaLevel(schema[key], currentValue);
    length = Object.keys(currentValue);
  }
  return { typeGuess, length };
  // if (priority.indexOf(typeGuess) >= priority.indexOf(currentType)) {
  //   return typeGuess;
  // } else {
  //   return currentType;
  // }
}

function getFieldRangeInfo(lengths) {
  return {
    min: lengths[0],
    max: lengths[lengths.length - 1],
    max90: lengths[parseInt(lengths.length * 0.9, 10)]
  };
}
