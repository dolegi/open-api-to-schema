"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
const converter_1 = __importDefault(require("./converter"));
const SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#';
function convert(filePath, config) {
    if (!fs_1.default.existsSync(filePath)) {
        throw Error(`Could not find swagger file at: ${path_1.default.resolve(filePath)}`);
    }
    const file = fs_1.default.readFileSync(filePath).toString('utf-8');
    const data = js_yaml_1.default.safeLoad(file);
    const definitions = data.definitions;
    const required = config.required || types_1.Required.RESPECT;
    const schema = { definitions: {}, paths: {} };
    let fields = {};
    switch (required) {
        case types_1.Required.RESPECT:
            fields = {};
            break;
        case types_1.Required.ALL:
            fields = config.optionalFields || {};
            break;
        case types_1.Required.NONE:
            fields = config.requiredFields || {};
            break;
    }
    const converter = new converter_1.default({ schema, definitions, fields, required });
    Object.keys(definitions).forEach(key => {
        const definition = definitions[key];
        definition['$schema'] = SCHEMA_VERSION;
        definition['$name'] = key;
        schema.definitions[key] = converter.convertDefinition(definition);
    });
    Object.keys(data.paths).forEach(path => {
        schema.paths[path] = {};
        Object.keys(data.paths[path]).forEach(method => {
            schema.paths[path][method] = {};
            Object.keys(data.paths[path][method].responses).forEach(response => {
                if (data.paths[path][method].responses[response].schema) {
                    schema.paths[path][method][response] = converter.convertDefinition(data.paths[path][method].responses[response].schema);
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