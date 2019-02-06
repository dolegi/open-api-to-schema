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

