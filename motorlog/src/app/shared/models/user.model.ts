import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
//prettier-ignore
export const USER_SCHEMA_LITERAL = {
    title: 'user schema',
    version: 0,
    description: 'User',
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', primary: true, maxLength: 100 },
        name: { type: 'string' },
        avatar: { type: 'string' },
        username: { type: 'string'}
    },
    required: ['id']
};

const schemaTyped = toTypedRxJsonSchema(USER_SCHEMA_LITERAL);
export type RxUserDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const USER_SCHEMA: RxJsonSchema<RxUserDocumentType> = USER_SCHEMA_LITERAL;


export interface UserModel {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

