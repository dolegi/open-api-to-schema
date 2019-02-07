import { Fields, Required, Schema } from './types'

export default class Converter {
  schema: Schema
  definitions: object
  fields: Fields
  required: Required = Required.RESPECT

  constructor ({ schema, definitions, fields, required }) {
    this.schema = schema
    this.definitions = definitions
    this.fields = fields
    this.required = required
  }

  convertDefinition = (oDefinition) => {
    let definition = JSON.parse(JSON.stringify(oDefinition || {}))
    if (definition.allOf) {
      return this.allOf(definition)
    }
    if (definition['$ref']) {
      return this.replaceRefs(definition)
    }
    if (definition.type === 'object') {
      return this.typeObject(definition)
    }
    if (definition.type === 'array') {
      return this.typeArray(definition)
    }

    return definition
  }

  getRequired = (definition) => {
    switch (this.required) {
      case Required.RESPECT:
        return definition.required || []
      case Required.ALL:
        return Object.keys(definition.properties).filter(key => {
          const field = this.fields[definition['$name']]

          return !field || field.indexOf(key) === - 1
        })
      case Required.NONE:
        return this.fields[definition['$name']] || []
    }
  }

  allOf = (definition) => {
    const refDefinition = this.replaceRefs(definition.allOf[0])
    definition.properties = { ...refDefinition.properties, ...definition.allOf[1].properties }

    definition.required = this.getRequired(definition)
    definition.additionalProperties = false
    delete definition.allOf

    return definition
  }

  typeObject = (definition) => {
    definition.properties = this.replaceRefs(definition.properties)

    definition.required = this.getRequired(definition)
    definition.additionalProperties = false

    return definition
  }

  typeArray = (definition) => {
    definition.items = this.replaceRefs(definition.items)
    return definition
  }

  replaceRefs = (oDefinition) => {
    let definition = JSON.parse(JSON.stringify(oDefinition || {}))
    Object.keys(definition).forEach(key => {
      if (key === '$ref') {
        const ref = definition[key].slice('#/definitions/'.length)
        definition = this.schema.definitions[ref] || this.convertDefinition(this.definitions[ref])
      } else {
        definition[key] = this.convertDefinition(definition[key])
      }
    })
    return definition
  }
}
