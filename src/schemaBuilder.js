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
const DATA_DEFAULT_TYPE = { type: "null" };

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
  // Summarize field/column data so only minimal field metadata is sent along to the Writer Adapters.
  schema._summary = fields.map(fieldName => {
    const fieldSummaryArray = schema._fieldData[fieldName];
    // Get min & max bytes seen for string fields, and min & max range for numeric fields.
    const getFieldRangeByName = sizeField =>
      getFieldRangeInfo(
        fieldSummaryArray
          .map(f => f[sizeField])
          .sort()
          .filter(f => f != null)
      );
    const fieldLengths = getFieldRangeByName("length");
    // Get size info for floating point fields
    const fieldPrecisions = getFieldRangeByName("precision");
    const fieldScales = getFieldRangeByName("scale");

    // Count up each type's # of occurences
    const fieldTypesFound = fieldSummaryArray.reduce((counts, field) => {
      const name = field.typeGuess;
      counts[name] = counts[name] || 0;
      counts[name]++;
      return counts;
    }, {});
    // Get top type by sortting the types. We'll pass along all the type counts to the writer adapter.
    const typeRank = Object.entries(fieldTypesFound).sort(
      ([n1, count1], [n2, count2]) =>
        count1 > count2 ? -1 : count1 === count2 ? 0 : 1
    );
    return {
      fieldName,
      typeInfo: fieldTypesFound,
      typeRank,
      sizeInfo: {
        ...fieldLengths,
        precision: fieldPrecisions,
        scale: fieldScales
      }
    };
  });
  return schema;
}

function guessTypeSimple({ currentType, currentValue }) {
  if (currentValue == null || currentValue === "") {
    return DATA_DEFAULT_TYPE;
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
  let length = undefined;
  let precision = undefined;
  let scale = undefined;

  if (typeGuess === "Number") {
    length = parseFloat(currentValue);
    const significandAndMantissa = String(currentValue).split(".");
    if (significandAndMantissa.length === 2) {
      // floating point number!
      precision = significandAndMantissa.join("").length; // total # of numeric positions before & after decimal
      scale = significandAndMantissa[1].length;
    }
  }
  if (typeGuess === "String") length = String(currentValue).length;
  // console.log(`Guessed type for ${key}=${typeGuess}`);
  if (typeGuess === "Object" && Object.keys(currentValue).length >= 2) {
    if (recursive) return evaluateSchemaLevel(schema[key], currentValue);
    length = Object.keys(currentValue);
  }
  return { typeGuess, length, precision, scale };
  // if (priority.indexOf(typeGuess) >= priority.indexOf(currentType)) {
  //   return typeGuess;
  // } else {
  //   return currentType;
  // }
}

function getFieldRangeInfo(lengths) {
  if (!lengths || lengths.length < 1) return undefined;
  return {
    min: lengths[0],
    max: lengths[lengths.length - 1],
    max90: lengths[parseInt(lengths.length * 0.9, 10)]
  };
}
