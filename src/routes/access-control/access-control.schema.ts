import { RouteShorthandOptions } from "fastify";

export interface CreateRole {
    Headers:{
      authorization: string;
    },
    Body: {
        name: string;
        permissions: string[];
    };
}
export const CreateRoleOpts: RouteShorthandOptions = {
  schema: {
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: {type: 'string', minLength: 1},
      },
    },
    security: [{ bearerAuth: [] }],
    body: {
      type: "object",
      required: ["name", "permissions"],
      properties: {
        name: { type: "string" },
        permissions: {
          type: "array",
          items: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$"
          },
        },
      },
    },
  },
};
export interface CreatePermission{
  Headers: {
    authorization: string;
  };
  Body:{
    name:string,
    description:string
  }
}
export const CreatePermissionReqOpts:RouteShorthandOptions={
  schema:{
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: {type: 'string'},
      },
     
    },
    security: [{ bearerAuth: [] }],
    body:{
      type:'object',
      required:['name', 'description'],
      properties:{
        name:{type:"string"},
        description:{type:"string"},
      }
    },
    response:{
      200:{
        type:'object',
        properties:{
          success:{type:"boolean"},
          message:{type:"string"}
        }
      },
      500:{
        type:'object',
        properties:{
          success:{type:"boolean"},
          message:{type:"string"}
       }
      }
    }
  }
}