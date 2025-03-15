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
    tags:['User'],
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
    password:string,
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
    tags:['User'],
    security: [{ bearerAuth: [] }],
    headers:{
      type:'object',
      required:['authorization'],
      properties:{
        authorization:{type:'string'}
      }
    },
    body: {
      type: 'object',
      required: ['name', 'username', 'phone', 'isActive', 'role', 'password', 'createdAt', 'updatedAt', 'updatedBy'],
      properties: {
        name: { type: 'string' },
        username: { type: 'string', minLength: 7 },
        password:{type:'string'},
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
    tags:['User'],
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
    security: [{ bearerAuth: [] }],
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
    tags:['User'],
    description: 'API to update user Role',
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: {type: 'string', minLength: 1},
      },
    },
    security: [{ bearerAuth: [] }],
    body:{
      type: 'object',
      required:['role'],
      properties:{
        role:{type:'string'},
        username:{type:'string'}
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

interface Login{
  Body:{
    username:string,
    password:string
  }
}
const LoginReqOpts: RouteShorthandOptions = {
  schema: {
    tags:['User'],
    description: "API to authenticate user and return JWT token",
    body: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string", minLength: 5 },
        password: { type: "string", minLength: 8 }, 
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          token: { type: "string" },
          refreshToken: { type: "string" },
          message: { type: "string" },
        },
        required: ["success", "token", "refreshToken", "message"],
      },
      401: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
      500:{
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required:['message', 'success']
      }
    },
  },
};

export { GetAllUsersOpts, CreateUserOpts, UpdateUserOpts, UpdateUserRoleReqOpt, LoginReqOpts };
export type { CreateUser, UpdateUser, UpdateUserRole, Login };
