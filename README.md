# Schema Generator

## Generate magical auto-typed code & database interfaces!

> An Open Source joint by [Dan Levy](https://danlevy.net/) ✨

[Schema **Generator**](https://github.com/justsml/schema-generator) is a web app which relies on it's sister library [Schema **Analyzer**](https://github.com/justsml/schema-analyzer) to provide an automatic code+interface generator - **based purely on provided JSON/CSV data.**


### Currently Supports...

- [x] Mongoose Schema definition - https://mongoosejs.com/
- [x] Knex Migration scripts - https://knexjs.org
- [ ] SQL DDL script (Data-definition language) - **Coming soon**
- [ ] TypeScript Types
- [ ] Validation Code for Libraries like `Yup` or `Joi`
- [ ] JSON Schemas (for libraries like `ajv`)
- [ ] Outputs for other languages/tools!

### Features

The primary goal is to support any input JSON/CSV and infer as much as possible. More data will generally yield better results.

- [x] Support SQL & noSQL systems!
- [x] Automatic type detection!
- [x] Detects String & Number size constraints (for SQL backends)!
- [x] Handles error/outliers intelligently
- [x] Ignores error/outlier records!
- [x] Smart field name formatting, snake-case vs. camel-case!
- [ ] Detects unique columns!
- [ ] Detects enum Fields!
- [ ] Detects `Not Null` fields!
- [x] Extensible design, add new output/target with ease!
- [ ] Nested data structure & multi-table relational output - **Coming soon**

