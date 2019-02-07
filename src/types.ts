export declare type Config = {
  optionalFields?: any
  requiredFields?: any
  required: string
}

export declare type Schema = {
  definitions: {
    [x: string]: any
  },
  paths: {
    [x: string]: any
  }
}

export const Required = {
  ALL: 'all',
  NONE: 'none',
  RESPECT: 'respect'
}
