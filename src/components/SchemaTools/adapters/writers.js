import typescriptWriter from './../../../generators/typescript-interfaces/writer.typescript'
import mongooseWriter from './../../../generators/mongoose-model/writer.mongoose'
import knexWriter from './../../../generators/knex-postgres/writer.knex'

const writers = {
  typescript: typescriptWriter,
  mongoose: mongooseWriter,
  knex: knexWriter
}

export const writerLanguages = {
  typescript: 'typescript',
  mongoose: 'javascript',
  knex: 'javascript'
}
export const render = ({ schemaName, options, writer }) => (content) => {
  const renderer = writers[writer]
  if (!renderer) throw new Error(`Invalid Render Adapter Specified: ${writer}`)

  return renderer.render({ schemaName, options, results: content })
}
