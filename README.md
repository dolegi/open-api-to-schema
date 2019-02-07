# Open api schema converter

Converts open-api / swagger files to json schema objects ready to use with json schema validation libraries.

## Usage
`npm install --save open-api-to-schema`

```javascript
import openApiToSchema from 'open-api-to-schema'
import Ajv from 'ajv'

const config = {
  required: 'all',
  optionalFields: {
    Pet: [ 'id' ]
  }
}

const jsonSchemas = openApiToSchema('./test/fixtures/petstore-expanded.yaml', config)

const ajv = new Ajv()
const validator = ajv.compile(jsonSchema.paths['/pet'].get[200])

const valid = validator(response.data)

if (!valid) {
  console.error(validator.errors)
}
...
```

## Returns
Returns a valid [JSON Schema draft 7](https://tools.ietf.org/html/draft-handrews-json-schema-01) object ready to be used with json validation libraries such as [ajv](https://www.npmjs.com/package/ajv).

Definitions and paths are root objects.

See [Example Response](##Example Response)

## Config

### `required`
required is on of :-
- `respect` // required fields from schema are used
- `all` // all fields are required expect `optionalFields`
- `none` // no fields are required expect `requiredFields`

### `optionalFields`
Only used when `required` is set to `all`.
Defines the fields that should not be set to required.
Has definition name as key with array of optional fields

```
{
  [definitionName]: [ 'unrequired' ]
}
```

### `requiredFields`
Only used when `required` is set to `none`.
Defines the fields that should be set to required.
Has definition name as key with array of required fields

```
{
  [definitionName]: [ 'required' ]
}
```
## Features

- [X] Allof
- [ ] Oneof
- [ ] Anyof
- [X] Expose definitions
- [X] Expose paths
- [X] Override requiring

## Example Response
```json
{
  "/pets": {
    "get": {
      "200": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$name": "Pet",
          "properties": {
            "name": {
              "type": "string"
            },
            "tag": {
              "type": "string"
            },
            "id": {
              "type": "integer",
              "format": "int64"
            }
          },
          "required": [
            "name",
            "tag"
          ],
          "additionalProperties": false
        }
      },
      "default": {
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          }
        },
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$name": "Error"
      }
    },
    "post": {
      "200": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$name": "Pet",
        "properties": {
          "name": {
            "type": "string"
          },
          "tag": {
            "type": "string"
          },
          "id": {
            "type": "integer",
            "format": "int64"
          }
        },
        "required": [
          "name",
          "tag"
        ],
        "additionalProperties": false
      },
      "default": {
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          }
        },
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$name": "Error"
      }
    }
  },
  "/pets/{id}": {
    "get": {
      "200": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$name": "Pet",
        "properties": {
          "name": {
            "type": "string"
          },
          "tag": {
            "type": "string"
          },
          "id": {
            "type": "integer",
            "format": "int64"
          }
        },
        "required": [
          "name",
          "tag"
        ],
        "additionalProperties": false
      },
      "default": {
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          }
        },
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$name": "Error"
      }
    },
    "delete": {
      "204": {},
      "default": {
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          }
        },
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$name": "Error"
      }
    }
  }
}
```

