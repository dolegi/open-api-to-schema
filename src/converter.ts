import { Required, Schema } from './types'

export default class Converter {
  schema: Schema
  definitions: object
  required: string = Required.RESPECT
  fields: any

  constructor ({ schema, definitions, fields, required }) {
    this.schema = schema
    this.fields = fields
    this.definitions = definitions
    this.required = required
  }

  convertDefinition = (oDefinition, name) => {
    let definition = JSON.parse(JSON.stringify(oDefinition || {}))
    if (oDefinition === '') {
      definition = ''
    }
    if (definition.allOf) {
      return this.allOf(definition, name)
    }
    if (definition['$ref']) {
      return this.replaceRefs(definition)
    }
    if (definition.type === 'object') {
      return this.typeObject(definition, name)
    }
    if (definition.type === 'array') {
      return this.typeArray(definition)
    }

    return definition
  }

  getRequired = (definition, name) => {
    const filtered: Array<string> = this.fields[name] || []
    switch (this.required) {
      case Required.RESPECT:
        return definition.required || []
      case Required.ALL:
        return Object.keys(definition.properties).filter(x => filtered.indexOf(x) === - 1)
      case Required.NONE:
        return Object.keys(definition.properties).filter(x => filtered.indexOf(x) !== - 1)
    }
  }

  allOf = (definition, name) => {
    const refDefinition = this.replaceRefs(definition.allOf[0])
    definition.properties = { ...refDefinition.properties, ...definition.allOf[1].properties }

    definition.required = this.getRequired(definition, name)
    definition.additionalProperties = false
    delete definition.allOf

    return definition
  }

  typeObject = (definition, name) => {
    definition.properties = this.replaceRefs(definition.properties)

    definition.required = this.getRequired(definition, name)
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
        definition = this.schema.definitions[ref] || this.convertDefinition(this.definitions[ref], ref)
      } else {
        definition[key] = this.convertDefinition(definition[key], key)
      }
    })
    return definition
  }
}
