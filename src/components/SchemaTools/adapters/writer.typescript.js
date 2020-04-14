import camelcase from "lodash.camelcase";
import capitalize from "lodash.capitalize";

import debug from "debug";
const log = debug("writer:ts");

const BIG_INTEGER_MIN = 2147483647;

const getFieldLengthArg = (fieldName, maxLength) => {
  if (maxLength > 4000) return 8000;
  if (maxLength > 2000) return 4000;
  if (maxLength > 1000) return 2000;
  if (maxLength > 800) return 1000;
  if (maxLength > 600) return 800;
  if (maxLength > 400) return 600;
  if (maxLength > 200) return 400;
  if (maxLength > 100) return 200;
  if (maxLength > 80) return 100;
  if (maxLength > 60) return 80;
  if (maxLength > 40) return 60;
  if (maxLength > 20) return 40;
  return 20;
};

/**

Determine a "best guess" maximum field size, use the 90th percentile when
the distance between it and the maximum exceeds 30 percent (of the max value)

@example

Situation: A `City` field normally has a size range of 3-15 characters.
A glitch at our vendor swapped `City` with a huge text field in 1 record!

We don't want to set the limit way bigger than
necessary, as it'd be confusing and impact performance.

Reduced example - `very sparse` data: [3, 4, 5, 7, 9, 231429]
*/
const correctForErroneousMaximum = (threshold = 0.1, ninetiethPct, maximum) => {
  const gapLimit = threshold * maximum;
  const topTenPercentileRange = maximum - ninetiethPct;
  if (topTenPercentileRange > gapLimit) {
    log("Correcting for erroneous maximum field value:", {
      ninetiethPct,
      maximum,
    });
    return ninetiethPct;
  }
  return maximum;
};

/**
 * @returns TypeMetadata
 *
 * > Type details: https://github.com/justsml/schema-analyzer#data-analysis-results
 *
 * "String": {
 *   "count": 5,
 *   "length": {
 *     "min": 3,"avg": 7.2,"max": 15,
 *     "percentiles": [ 3, 10, 15 ]
 *   },
 *   "rank": 12
 * }
 */
const getMetadataByTypeName = (typeName, types) => {
  return types.find(
    (field) => field[0].toLowerCase() === typeName.toLowerCase()
  );
};

export default {
  render({ results, options, schemaName }) {
    const {
      bogusSizeThreshold = 0.1,
      defaultColumnFormatter = (name, fieldInfo, nullable = true) =>
        `    ${name}${nullable ? '?' : ''}: string${nullable ? ' | null' : ''}; // fallback for missing columns`,
    } = options || {};

    const enumTypes = []
    const fieldSummary = results.fields;
    // const uniqueCounts = results.uniques
    // const rowCount = results.rowCount

    const fieldPairs = Object.entries(fieldSummary).map((fieldNameAndInfo) => {
      const [fieldName, fieldInfo] = fieldNameAndInfo;
      const name = camelcase(fieldName);
      if (
        fieldInfo &&
        fieldInfo.types &&
        Object.keys(fieldInfo.types).length === 0
      ) {
        return defaultColumnFormatter(fieldName, fieldInfo, true);
      }
      let { types } = fieldInfo;
      types = Array.isArray(types) ? types : Object.entries(types);
      types = types
        .slice(0)
        .filter((f) => f[0] !== "Null" && f[0] !== "Unknown")
        .sort((a, b) =>
          a[1].count > b[1].count ? -1 : a[1].count === b[1].count ? 0 : 1
        );

      if (types.length === 0)
        return defaultColumnFormatter(fieldName, fieldInfo, true);

      let [topType, topTypeStats] = types[0];
      topType = topType.toLowerCase();
      const {
        length,
        scale,
        precision,
        value,
        unique,
        nullable,
        enum: enumData,
        count: typeCount,
      } = topTypeStats;

      if (
        (topType === "string" || topType === "number") &&
        enumData &&
        enumData.length > 0
      ) {
        // console.info(`ENUM Detected: ${name} (${uniques.length}) \n TODO: Get/add unique values from the SchemaAnalyzer`)
        enumTypes.push(`enum ${name} {
${enumData.map(name => `  ${name} = "${name}"`).join(",\n")}
}\n`);
      }

      // if (!nullable) {
      //   // likely a not-null type of field
      //   appendChain += ".notNull()";
      // }
      // if (
      //   unique &&
      //   (topType === "objectid" ||
      //     topType === "uuid" ||
      //     topType === "email" ||
      //     topType === "string" ||
      //     topType === "number")
      // ) {
      //   // rows have unique values for field
      //   appendChain += ".unique()";
      // }
      // if (name === "id" && unique) {
      //   // Override any possible redundant 'unique' method from above
      //   appendChain = ".primary()";
      // }
      if (topType === "unknown")
        return `    ${name}${nullable ? '?' : ''}: any${nullable ? ' | null' : ''};`;
      if (topType === "objectid") 
        return `    ${name}${nullable ? '?' : ''}: ObjectId | string${nullable ? ' | null' : ''};`;
      if (topType === "uuid")
        return `    ${name}${nullable ? '?' : ''}: UUID | string${nullable ? ' | null' : ''};`;
      if (topType === "boolean")
        return `    ${name}${nullable ? '?' : ''}: boolean${nullable ? ' | null' : ''};`;
      if (topType === "date")
        return `    ${name}${nullable ? '?' : ''}: Date${nullable ? ' | null' : ''};`;
      if (topType === "timestamp")
        return `    ${name}${nullable ? '?' : ''}: number${nullable ? ' | null' : ''};`;
      if (topType === "currency")
        return `    ${name}${nullable ? '?' : ''}: Currency | number${nullable ? ' | null' : ''};`;
      if (topType === "float" || topType === "number") {
        return `    ${name}${nullable ? '?' : ''}: ${
          value.max > BIG_INTEGER_MIN ? "bigint" : "number"
        }${nullable ? ' | null' : ''};`;
      }
      if (topType === "email" || topType === "string")
        return `    ${name}${nullable ? '?' : ''}: string${nullable ? ' | null' : ''};`;
      if (topType === "array")
        return `    ${name}${nullable ? '?' : ''}: Array<any>${nullable ? ' | null' : ''};`;
      if (topType === "object")
        return `    ${name}${nullable ? '?' : ''}: { [key: string]: any }${nullable ? ' | null' : ''};`;
      if (topType === "null") return `    ${name}${nullable ? '?' : ''}: string | null${nullable ? ' | null' : ''};`;

      return defaultColumnFormatter(name, fieldInfo, nullable);
    });

    schemaName = capitalize(camelcase(schemaName));

    return `
    
// Primary Type
export type ${schemaName} = {
${fieldPairs.join("\n")}
};

${enumTypes.join('\n')}

    `;
  }

}

