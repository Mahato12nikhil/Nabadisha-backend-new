import { RouteShorthandOptions } from "fastify";

const UserOpts = {
  type: "object",
  required: ["name", "username", "phone", "isActive", "createdAt", "updatedAt"],
  properties: {
    name: { type: "string" },
    username: { type: "string" },
    phone: { type: "string" },
    isActive: { type: "boolean" },
    userPic: { type: "string", format: "uri" },
    roles: { type: "array", items: { type: "string" } },
    socials: {
      type: "object",
      properties: {
        facebook: { type: "string" },
        instagram: { type: "string" },
        linkedin: { type: "string" },
      },
    },
    createdAt: { type: "integer" },
    createdBy: { type: "string" },
    updatedAt: { type: "integer" },
    updatedBy: { type: "string" },
  },
};
interface RenewLogin{
  Body:{
    refreshToken:string
  }
}
const GetAllUsersOpts: RouteShorthandOptions = {
  schema: {
    tags: ["User"],
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
    password: string;
    phone: string;
    isActive: boolean;
    userPic: string;
    roles: string[],
    socials?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

const CreateUserOpts: RouteShorthandOptions = {
  schema: {
    tags: ["User"],
    security: [{ bearerAuth: [] }],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: [
        "name",
        "username",
        "phone",
        "isActive",
        "roles",
        "password",
      ],
      properties: {
        name: { type: "string" },
        username: { type: "string", minLength: 7 },
        password: { type: "string" },
        phone: { type: "string" },
        isActive: { type: "boolean" },
        userPic: { type: "string", format: "uri" },
        roles: { type: "array", items: { type: "string" } },
        socials: {
          type: "object",
          properties: {
            facebook: { type: "string" },
            instagram: { type: "string" },
            linkedin: { type: "string" },
          },
          additionalProperties: false,
        },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          userId: { type: "string" },
        },
        required: ["success", "message", "userId"],
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
    tags: ["User"],
    body: {
      type: "object",
      required: ["name", "username", "updatedAt", "updatedBy"],
      properties: {
        name: { type: "string" },
        userPic: { type: "string", format: "uri" },
        username: { type: "string", minLength: 7 },
        socials: {
          type: "object",
          properties: {
            facebook: { type: "string" },
            instagram: { type: "string" },
            linkedin: { type: "string" },
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

interface UpdateUserRole {
  Body: { username: string; roles: string[] };
}
const UpdateUserRoleReqOpt: RouteShorthandOptions = {
  schema: {
    tags: ["User"],
    description: "API to update user Role",
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string", minLength: 1 },
      },
    },
    security: [{ bearerAuth: [] }],
    body: {
      type: "object",
      required: ["role"],
      properties: {
        roles: { type: "array", items: { type: "string" } },
        username: { type: "string" },
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
    },
  },
};

interface Login {
  Body: {
    username: string;
    password: string;
  };
}
const LoginReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["User"],
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
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
              user: UserOpts,
            },
          },
        },
      },
      401: {
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
        required: ["message", "success"],
      },
    },
  },
};
interface ResetPassword {
  Body: {
    username: string;
    password: string;
  };
}
const ResetPasswordReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["User"],
    description: "API to Reset password",
    body: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string", minLength: 5 },
        password: { type: "string" },
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
    },
  },
};
const RenewLoginReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["User"],
    description: "API to Renew Token",
    body: {
      type: "object",
      required: ["refreshToken"],
      properties: {
        refreshToken: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
              user: UserOpts,
            },
          },
        },
      },
      401: {
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
        required: ["message", "success"],
      },
    },
  },
};

export {
  GetAllUsersOpts,
  CreateUserOpts,
  UpdateUserOpts,
  UpdateUserRoleReqOpt,
  LoginReqOpts,
  ResetPasswordReqOpts,
  RenewLoginReqOpts
};
export type { CreateUser, UpdateUser, UpdateUserRole, Login, ResetPassword, RenewLogin };
