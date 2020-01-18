export default {
  render(schemaName, fields) {
    fields._uniques = undefined;
    fields._totalRecords = undefined;
    const fieldString = JSON.stringify(fields, null, 2);

    return `const mongoose = require("mongoose");
const {Schema} = mongoose;

const schema = new Schema(${fieldString.replace(/\\n/gms, "\n")});

const model = mongoose.model("${schemaName}", schema);

module.exports = model;
`;
  }
};
