import fs from 'fs'
import jsYaml from 'js-yaml'

const SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#'

type OptionalFields = {
  [x: string]: [
    string
  ]
}
let definitions: object = {}
let optionalFields: OptionalFields = {}
const schema = { definitions: {}, paths: {} }

function convertDefinition (oDefinition: any) {
  let definition = JSON.parse(JSON.stringify(oDefinition || {}))
  if (definition.allOf) {
    const refDefinition = replaceRefs(definition.allOf[0])
    definition.properties = { ...refDefinition.properties, ...definition.allOf[1].properties }

    definition.required = Object.keys(definition.properties).filter(x => (optionalFields[definition['$name']] || []).indexOf(x) === - 1)
    definition.additionalProperties = false
    delete definition.allOf
  }
  if (definition['$ref']) {
    return replaceRefs(definition)
  }
  if (definition.type === 'object') {
    definition.properties = replaceRefs(definition.properties)

    definition.required = Object.keys(definition.properties).filter(x => (optionalFields[definition['$name']] || []).indexOf(x) === - 1)
    definition.additionalProperties = false
  }
  if (definition.type === 'array') {
    definition.items = replaceRefs(definition.items)
  }

  return definition
}

function replaceRefs (oDefinition: any) {
  let definition = JSON.parse(JSON.stringify(oDefinition || {}))
  Object.keys(definition).forEach(key => {
    if (key === '$ref') {
      const ref = definition[key].slice('#/definitions/'.length)
      definition = schema.definitions[ref] || convertDefinition(definitions[ref])
    } else {
      definition[key] = convertDefinition(definition[key])
    }
  })
  return definition
}

export default function convert (filePath: string, optionalFields: OptionalFields): any {
  if (!fs.existsSync(filePath)) {
    throw Error(`Could not find swagger file at: ${filePath}`)
  }
  const file = fs.readFileSync(filePath).toString('utf-8')
  const data = jsYaml.safeLoad(file)
  definitions = data.definitions
  optionalFields = optionalFields

  Object.keys(definitions).forEach(key => {
    const definition = definitions[key]
    definition['$schema'] = SCHEMA_VERSION
    definition['$name'] = key

    schema.definitions[key] = convertDefinition(definition)
  })

  Object.keys(data.paths).forEach(path => {
    schema.paths[path] = {}
    Object.keys(data.paths[path]).forEach(method => {
      schema.paths[path][method] = {}
      Object.keys(data.paths[path][method].responses).forEach(response => {
        if (data.paths[path][method].responses[response].schema) {
          schema.paths[path][method][response] = convertDefinition(data.paths[path][method].responses[response].schema)
        } else {
          schema.paths[path][method][response] = {}
        }
      })
    })
  })

  // console.log(data)
  console.log(JSON.stringify(schema.paths))
  return schema
}

convert(process.argv[3], {})
