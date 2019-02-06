"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#';
var Required;
(function (Required) {
    Required["ALL"] = "all";
    Required["NONE"] = "none";
    Required["RESPECT"] = "respect";
})(Required = exports.Required || (exports.Required = {}));
let definitions = {};
let fields = {};
let required = Required.RESPECT;
const schema = { definitions: {}, paths: {} };
function getRequiredObj(definition) {
    switch (required) {
        case Required.RESPECT:
            return definition.required || [];
        case Required.ALL:
            return Object.keys(definition.properties).filter(key => {
                const field = fields[definition['$name']];
                return !field || field.indexOf(key) === -1;
            });
        case Required.NONE:
            return fields[definition['$name']] || [];
    }
}
function allOf(definition) {
    const refDefinition = replaceRefs(definition.allOf[0]);
    definition.properties = Object.assign({}, refDefinition.properties, definition.allOf[1].properties);
    definition.required = getRequiredObj(definition);
    definition.additionalProperties = false;
    delete definition.allOf;
    return definition;
}
function typeObject(definition) {
    definition.properties = replaceRefs(definition.properties);
    definition.required = getRequiredObj(definition);
    definition.additionalProperties = false;
    return definition;
}
function typeArray(definition) {
    definition.items = replaceRefs(definition.items);
    return definition;
}
function convertDefinition(oDefinition) {
    let definition = JSON.parse(JSON.stringify(oDefinition || {}));
    if (definition.allOf) {
        return allOf(definition);
    }
    if (definition['$ref']) {
        return replaceRefs(definition);
    }
    if (definition.type === 'object') {
        return typeObject(definition);
    }
    if (definition.type === 'array') {
        return typeArray(definition);
    }
    return definition;
}
function replaceRefs(oDefinition) {
    let definition = JSON.parse(JSON.stringify(oDefinition || {}));
    Object.keys(definition).forEach(key => {
        if (key === '$ref') {
            const ref = definition[key].slice('#/definitions/'.length);
            definition = schema.definitions[ref] || convertDefinition(definitions[ref]);
        }
        else {
            definition[key] = convertDefinition(definition[key]);
        }
    });
    return definition;
}
function convert(filePath, config) {
    if (!fs_1.default.existsSync(filePath)) {
        throw Error(`Could not find swagger file at: ${path_1.default.resolve(filePath)}`);
    }
    const file = fs_1.default.readFileSync(filePath).toString('utf-8');
    const data = js_yaml_1.default.safeLoad(file);
    definitions = data.definitions;
    required = config.required || Required.RESPECT;
    switch (required) {
        case Required.RESPECT:
            fields = {};
            break;
        case Required.ALL:
            fields = config.optionalFields || {};
            break;
        case Required.NONE:
            fields = config.requiredFields || {};
            break;
    }
    Object.keys(definitions).forEach(key => {
        const definition = definitions[key];
        definition['$schema'] = SCHEMA_VERSION;
        definition['$name'] = key;
        schema.definitions[key] = convertDefinition(definition);
    });
    Object.keys(data.paths).forEach(path => {
        schema.paths[path] = {};
        Object.keys(data.paths[path]).forEach(method => {
            schema.paths[path][method] = {};
            Object.keys(data.paths[path][method].responses).forEach(response => {
                if (data.paths[path][method].responses[response].schema) {
                    schema.paths[path][method][response] = convertDefinition(data.paths[path][method].responses[response].schema);
                }
                else {
                    schema.paths[path][method][response] = {};
                }
            });
        });
    });
    return schema;
}
exports.default = convert;
//# sourceMappingURL=index.js.map