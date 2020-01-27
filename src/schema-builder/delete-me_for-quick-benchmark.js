import { schemaBuilder, condenseFieldData } from './index.js'
import fs from 'fs'
import { getFilePath } from './utils/get-file.js'

// @ts-ignore
const usersData = getFilePath('./schema-generator/public/users.example.json')
const propertyData = getFilePath('./schema-generator/public/real-estate.example.json')
const users = JSON.parse(fs.readFileSync(usersData, { encoding: 'utf8' }))
const properties = JSON.parse(fs.readFileSync(propertyData, { encoding: 'utf8' }))
// import people from '../../public/swapi-people.json'
// users = users.slice(0, 5)
console.time('Loading Schemas')
schemaBuilder('users', users)
  .then(() => schemaBuilder('property', properties))
  .then(() => schemaBuilder('users', users))
  .then(() => schemaBuilder('property', properties))
  .then(() => console.timeEnd('Loading Schemas'))
  // .then(() => schemaBuilder('users', users))
      // .then(() => schemaBuilder('property', properties))

