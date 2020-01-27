import { schemaBuilder, condenseFieldData } from './index.js'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

// @ts-ignore
const __dirname = pathToFileURL(import.meta.url).toString().split(':')[1];
console.log('__dirname', __dirname)
const dataPath = path.resolve('..', './schema-generator/public/users.example.json')
console.log('dataPath', dataPath)
let users = JSON.parse(fs.readFileSync(dataPath, { encoding: 'utf8' }))
// import people from '../../public/swapi-people.json'
users = users.slice(0, 5)

schemaBuilder('users', users)

