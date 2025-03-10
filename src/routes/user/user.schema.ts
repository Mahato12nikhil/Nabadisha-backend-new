import { RouteShorthandOptions } from "fastify";

const UserOpts = {
  type: "object",
  required: ["_id", "name", "username", "phone", "isActive", "createdAt", "updatedAt"],
  properties: {
    _id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" }, 
    name: { type: "string" },
    username: { type: "string" },
    phone: { type: "string" },
    isActive:{type:'boolean'},
    userPic: { type: "string" },
    role: { type: "string"},
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
    updatedBy:{type:"string"}
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
      500:{
        type:'object',
        properties:{
            success:{type:'boolean'},
            message:{type:'string'}
        },
        required: ["success", "message"],
      }
    },
    
  },
};

interface CreateUser{
    // Headers:{
    //     authorization:string
    // },
    Body:{
        name: string,
        username:string,
        phone: string,
        isActive:boolean,
        userPic:string,
        role: string, 
        socials?: {
            facebook?: string,
            instagram?: string,
            linkedin?: string,
        },
        createdAt: number, 
        updatedAt: number,
        updatedBy:string
    }
}

const CreateUserOpts : RouteShorthandOptions={
    schema:{
        body:{
            type:'object',
            required:["name", "username", "phone", "isActive", "userPic", "role", "createdAt", "updatedAt", "updatedBy"],
            properties:{
                name: {type:"string"},
                username: {type:"string"},
                phone:  {type:"string"},
                isActive: {type:"boolean"},
                userPic: {type:"string"},
                role: {type:"string"},
                socials: {
                    type: "object",
                    properties: {
                        facebook: { type: "string" },
                        instagram: { type: "string" },
                        linkedin: { type: "string" },
                    },
                    additionalProperties: false, 
                },
                createdAt:  {type:"integer"}, 
                updatedAt:  {type:"integer"},
                updatedBy: {type:"string"}
            }
        },
        response:{
            200:{
                type:"object",
                properties:{
                    success:{type: "boolean"},
                    message: {type:"string"}
                },
                required: ["success", "message"],
            },
            500:{
                type:"object",
                properties:{
                    success:{type: "boolean"},
                    message: {type:"string"}
                },
                required: ["success", "message"],
            },
            409:{
                type:"object",
                properties:{
                    success:{type: "boolean"},
                    message: {type:"string"}
                },
                required: ["success", "message"],
            }
        }
    }
}

export { GetAllUsersOpts, CreateUserOpts };    
export type { CreateUser };

