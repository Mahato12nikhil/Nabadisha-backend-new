import { RouteShorthandOptions } from "fastify";

const UserOpts = {
  type: "object",
  required: [
    "_id",
    "name",
    "username",
    "phone",
    "isActive",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    _id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
    name: { type: "string" },
    username: { type: "string" },
    phone: { type: "string" },
    isActive: { type: "boolean" },
    userPic: { type: "string", format:'uri' },
    role: { type: "string" },
    socials: {
      type: "object",
      properties: {
        facebook: { type: "string" },
        instagram: { type: "string" },
        linkedin: { type: "string" },
      },
    },
    createdAt: { type: "integer" },
    updatedAt: { type: "integer" },
    updatedBy: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
  },
};

const GetAllUsersOpts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          users: { type: "array", items: UserOpts },
        },
        required: ["success", "users"],
      },
      500: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
    },
  },
};

interface CreateUser {
  // Headers:{
  //     authorization:string
  // },
  Body: {
    name: string;
    username: string;
    phone: string;
    isActive: boolean;
    userPic: string;
    role: string;
    socials?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
    createdAt: number;
    updatedAt: number;
    updatedBy: string;
  };
}

const CreateUserOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'username', 'phone', 'isActive', 'role', 'createdAt', 'updatedAt', 'updatedBy'],
      properties: {
        name: { type: 'string' },
        username: { type: 'string', minLength: 7 },
        phone: { type: 'string' },
        isActive: { type: 'boolean' },
        userPic:{ type: 'string', format: 'uri' },
        role: { type: 'string' },
        socials: {
          type: 'object',
          properties: {
            facebook: { type: 'string' },
            instagram: { type: 'string' },
            linkedin: { type: 'string' },
          },
          additionalProperties: false,
        },
        createdAt: { type: 'integer' },
        updatedAt: { type: 'integer' },
        updatedBy: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          userId: { type: 'string' },
        },
        required: ['success', 'message', 'userId'],
      },
      500: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
        required: ['success', 'message'],
      },
      409: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
        required: ['success', 'message'],
      },
    },
  },
};
interface UpdateUser {
  Headers: {
    Authorization: string;
  };
  Body: {
    name: string;
    userPic?: string;
    username: string;
    socials?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
    updatedAt: number;
    updatedBy: string;
  };
}

const UpdateUserOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["name", "username", "updatedAt", "updatedBy"],
      properties: {
        name: { type: "string" },
        userPic: { type: "string", format:'uri' },
        username: { type: "string", minLength: 7 },
        socials: {
          type: "object",
          properties: {
            facebook: { type: "string" },
            instagram: { type: "string" },
            linkedin: { type: "string"},
          },
          additionalProperties: false,
        },
        updatedAt: { type: "integer" },
        updatedBy: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
      500: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
      409: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
    },
  },
};

interface UpdateUserRole{Body:{username:string,role:string}}
const UpdateUserRoleReqOpt: RouteShorthandOptions={
  schema:{
    description: 'API to update FCM token for the user in the database',
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: {type: 'string', minLength: 1},
      },
    },
    body:{
      type: 'object',
      required:['role'],
      properties:{
        role:{type:'string'},
      }
    },
    response:{
      200:{
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      }
    }
  }
}
export { GetAllUsersOpts, CreateUserOpts, UpdateUserOpts, UpdateUserRoleReqOpt };
export type { CreateUser, UpdateUser, UpdateUserRole };
