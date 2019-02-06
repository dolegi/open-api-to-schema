import openApiSchema, { Config, Required } from '../src/index'

describe('index', () => {
  test('Converts schema with optional fields', () => {
    const config: Config = {
      required: Required.ALL,
      optionalFields: {
        Pet: [ 'id' ]
      }
    }

    const schema = openApiSchema('./test/fixtures/petstore-expanded.yaml', config)
    expect(schema).toMatchSnapshot()
  })
})
