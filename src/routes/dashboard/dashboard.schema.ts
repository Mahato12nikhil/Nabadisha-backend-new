import { RouteShorthandOptions } from "fastify";

export interface PostDashQuery {
  Headers: {
    authorization: string;
  };
  Body: {
    roles: string[];
  };
}
const PostDashMenuReq: RouteShorthandOptions = {
  schema: {
    tags:['Dashboard'],
    body: {
      type: 'object',
      required: ['roles'],
      properties: {
        roles: { type: 'array', items: { type: 'string' } }
      }
    },
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            required: ['permissions'], 
            properties: {
              permissions: { type: 'array', items: { type: 'string' } } 
            }
          },
        }
      },
      500: {
        type: 'object',
        required: ['success', 'message'],
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        }
      }
    }
  }
};



export { PostDashMenuReq };
