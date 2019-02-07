import { Fields, Required, Schema } from './types';
export default class Converter {
    schema: Schema;
    definitions: object;
    fields: Fields;
    required: Required;
    constructor({ schema, definitions, fields, required }: {
        schema: any;
        definitions: any;
        fields: any;
        required: any;
    });
    convertDefinition: (oDefinition: any) => any;
    getRequired: (definition: any) => any;
    allOf: (definition: any) => any;
    typeObject: (definition: any) => any;
    typeArray: (definition: any) => any;
    replaceRefs: (oDefinition: any) => any;
}
