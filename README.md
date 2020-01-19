# Schema Generator

> An open source tool brought to you by Dan Levy ✨

## Generate intelligent auto-typed database scripts from JSON or CSV.

### Currently Supports...

- [x] Mongoose Schema definition - https://mongoosejs.com/
- [x] Knex Migration scripts - https://knexjs.org
- [ ] SQL DDL script (Data-definition language) - **Coming soon**

### Features

The primary goal is to support any input JSON/CSV and infer as much as possible. More data will generally yield better results.

- [x] Support SQL & noSQL systems!
- [x] Automatic type detection!
- [x] Detects unique columns!
- [x] Detects enum Fields!
- [x] Detects `Not Null` fields!
- [x] Detects String & Number size constraints (for SQL backends)!
- [x] Ignores error/outlier records!
- [x] Smart field name formatting, snake-case vs. camel case!
- [x] Extensible design, add new output/target with ease!
- [ ] Nested data structure & multi-table relational output - **Coming soon**
