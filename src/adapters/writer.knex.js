import snakecase from "lodash.snakecase";

const getFieldLengthArg = (fieldName, maxLength) => {
  if (maxLength > 4000) return `, 8000`;
  if (maxLength > 2000) return `, 4000`;
  if (maxLength > 1000) return `, 2000`;
  if (maxLength > 800) return `, 1000`;
  if (maxLength > 600) return `, 800`;
  if (maxLength > 400) return `, 600`;
  if (maxLength > 200) return `, 400`;
  if (maxLength > 100) return `, 200`;
  if (maxLength > 80) return `, 100`;
  if (maxLength > 60) return `, 80`;
  if (maxLength > 40) return `, 60`;
  if (maxLength > 20) return `, 40`;
  return `, 20`;
};

export default {
  render({ schemaName, results, options }) {
    console.log(results);
    // results._uniques = undefined;
    // results._totalRecords = undefined;
    const fieldSummary = results._summary;

    const fieldDefs = fieldSummary
      .map(f => {
        const { fieldName, typeRank, typeInfo, sizeInfo } = f;
        let appendChain = ``;
        let topType = (typeRank && typeRank[0] && typeRank[0][0]) || "String";
        topType = topType.toLowerCase();
        if (topType === "null")
          topType = (typeRank && typeRank[1] && typeRank[1][0]) || "string";
        let typeMethod =
          fieldName === "id" && topType === "number" ? "serial" : topType;
        let sizePart =
          topType === "string" && fieldName !== "id"
            ? getFieldLengthArg(fieldName, sizeInfo.max)
            : "";
        typeMethod = typeMethod === "date" ? "datetime" : typeMethod;
        if (sizeInfo.precision && sizeInfo.precision.max) {
          typeMethod = "float";
          sizePart = `, ${1 + sizeInfo.precision.max}, ${sizeInfo.scale.max}`;
        } else if (topType === "number" && sizeInfo.max > 2147483647) {
          typeMethod = "bigInteger";
          sizePart = "";
        } else if (topType === "number") {
          typeMethod = "integer";
        }
        if (fieldName === "id") appendChain = ".primary()";
        console.log(fieldName, sizeInfo);
        return `      table.${typeMethod}("${snakecase(
          f.fieldName
        )}"${sizePart})${appendChain};`;
      })
      .join(`\n`);

    const tableName = snakecase(schemaName);
    return `// More info: http://knexjs.org/#Schema-createTable

exports.up = function up(knex) {
  return knex.schema
    .createTable("${tableName}", (table) => {
${fieldDefs.replace(/\\n/gms, "\n")}
    });
};

exports.down = function down(knex) {
  return knex.schema
    .dropTableIfExists("${tableName}");
};

`;
  }
};

/*
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id')
      table.string('name', 256)
      table.integer('age')
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
};
*/
