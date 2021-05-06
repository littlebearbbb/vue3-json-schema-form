// 定义枚举类型，注意这里枚举的写法
export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}
// 定义Schema的类型
type SchemaRef = { $ref: string }

// 定义Schema的接口类型，其中带?的为非必要属性，注意其中object定义类型的写法
/**
 * 这里的Schema相当于是类型递归
 * [key: string]: Schema
 *
 * 注意这里数组类型的写法，string[]
 */
export interface Schema {
  type: SchemaTypes | string
  const?: any
  format?: string
  default?: any
  properties?: {
    [key: string]: Schema | { $ref: string }
  }
  items?: Schema | Schema[] | SchemaRef
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  required?: string[]
  enum?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema
}
