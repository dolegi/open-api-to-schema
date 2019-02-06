# Open api schema converter

## Usage
```
const config = {
  required: 'all',
  optionalFields: {
    Pet: [ 'id' ]
  }
}

const jsonSchema = openApiSchema('./test/fixtures/petstore-expanded.yaml', config)
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
