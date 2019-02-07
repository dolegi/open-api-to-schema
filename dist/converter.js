"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class Converter {
    constructor({ schema, definitions, fields, required }) {
        this.required = types_1.Required.RESPECT;
        this.convertDefinition = (oDefinition) => {
            let definition = JSON.parse(JSON.stringify(oDefinition || {}));
            if (definition.allOf) {
                return this.allOf(definition);
            }
            if (definition['$ref']) {
                return this.replaceRefs(definition);
            }
            if (definition.type === 'object') {
                return this.typeObject(definition);
            }
            if (definition.type === 'array') {
                return this.typeArray(definition);
            }
            return definition;
        };
        this.getRequired = (definition) => {
            switch (this.required) {
                case types_1.Required.RESPECT:
                    return definition.required || [];
                case types_1.Required.ALL:
                    return Object.keys(definition.properties).filter(key => {
                        const field = this.fields[definition['$name']];
                        return !field || field.indexOf(key) === -1;
                    });
                case types_1.Required.NONE:
                    return this.fields[definition['$name']] || [];
            }
        };
        this.allOf = (definition) => {
            const refDefinition = this.replaceRefs(definition.allOf[0]);
            definition.properties = Object.assign({}, refDefinition.properties, definition.allOf[1].properties);
            definition.required = this.getRequired(definition);
            definition.additionalProperties = false;
            delete definition.allOf;
            return definition;
        };
        this.typeObject = (definition) => {
            definition.properties = this.replaceRefs(definition.properties);
            definition.required = this.getRequired(definition);
            definition.additionalProperties = false;
            return definition;
        };
        this.typeArray = (definition) => {
            definition.items = this.replaceRefs(definition.items);
            return definition;
        };
        this.replaceRefs = (oDefinition) => {
            let definition = JSON.parse(JSON.stringify(oDefinition || {}));
            Object.keys(definition).forEach(key => {
                if (key === '$ref') {
                    const ref = definition[key].slice('#/definitions/'.length);
                    definition = this.schema.definitions[ref] || this.convertDefinition(this.definitions[ref]);
                }
                else {
                    definition[key] = this.convertDefinition(definition[key]);
                }
            });
            return definition;
        };
        this.schema = schema;
        this.definitions = definitions;
        this.fields = fields;
        this.required = required;
    }
}
exports.default = Converter;
//# sourceMappingURL=converter.js.map