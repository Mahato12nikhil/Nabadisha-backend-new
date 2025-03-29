import { RouteShorthandOptions } from "fastify";
const ContentType = {
  type: "object",
  required: ["_id", "section", "content"],
  properties: {
    _id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
    section: { type: "string" },
    content: { 
      type: "object",
      required: ["en", "bn"],
      properties: {
        en: { 
          type: "object",
          additionalProperties: true 
        },
        bn: { 
          type: "object",
          additionalProperties: true 
        }
      },
      additionalProperties: true 
    }
  },
};


export interface ContentBody {
    _id: string;
    section: string;
    content: object;
}
const GetContentReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["Content"],
    response: {
      200: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean" },
          data: { type: "array", items: ContentType }, 
        },
      },
    },
  },
};

const CreateContentReqOpts: RouteShorthandOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Content"],
    body: ContentType,
    response: {
      201: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: ContentType,
        },
      },
    },
  },
};

const UpdateContentReqOpts: RouteShorthandOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Content"],
    body: {
      type: "object",
      required: ["_id"],
      properties: {
        _id: { type: "string", pattern: "^[a-fA-F0-9]{24}$"  },
        section: { type: "string" },
        content: { type: "object" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};

export { GetContentReqOpts, CreateContentReqOpts, UpdateContentReqOpts };
