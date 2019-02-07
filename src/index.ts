import fs from 'fs'
import jsYaml from 'js-yaml'
import path from 'path'
import { Fields, Required, Config, Schema } from './types'
import Converter from './converter'

const SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#'

export default function convert (filePath: string, config: Config) {
  if (!fs.existsSync(filePath)) {
    throw Error(`Could not find swagger file at: ${path.resolve(filePath)}`)
  }

  const file = fs.readFileSync(filePath).toString('utf-8')
  const data = jsYaml.safeLoad(file)

  const definitions = data.definitions
  const required: Required = config.required || Required.RESPECT
  const schema: Schema = { definitions: {}, paths: {} }
  let fields: Fields = {}
  switch (required) {
    case Required.RESPECT:
      fields = {}
      break
    case Required.ALL:
      fields = config.optionalFields || {}
      break
    case Required.NONE:
      fields = config.requiredFields || {}
      break
  }

  const converter = new Converter({ schema, definitions, fields, required })
  Object.keys(definitions).forEach(key => {
    const definition = definitions[key]
    definition['$schema'] = SCHEMA_VERSION
    definition['$name'] = key

    schema.definitions[key] = converter.convertDefinition(definition)
  })

  Object.keys(data.paths).forEach(path => {
    schema.paths[path] = {}
    Object.keys(data.paths[path]).forEach(method => {
      schema.paths[path][method] = {}
      Object.keys(data.paths[path][method].responses).forEach(response => {
        if (data.paths[path][method].responses[response].schema) {
          schema.paths[path][method][response] = converter.convertDefinition(data.paths[path][method].responses[response].schema)
        } else {
          schema.paths[path][method][response] = {}
        }
      })
    })
  })

  return schema
}

