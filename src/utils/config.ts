import { SwaggerOptions } from "@fastify/swagger";

export const RELATIVE_DIST_STATIC_FOLDER = '../public';

// route prefix for APIs
export const API_ROUTE_PREFIX = '/api/v1';

  // In utils/config.js
export const SWAGGER_CONFIG_OPTS: SwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Nabdisha backend APIs',
      description: 'Nabdisha backend APIs docs',
      version: '0.0.1',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
};
  type RouteName={
    method:'POST' | 'GET' | 'PUT',
    url:string
  } 

  export const REFRESH_TOKEN_EXPIRY='90d';
  export const TOKEN_EXPIRY='1d';
  export const DEFAULT_PAGE_SIZE=10;
  export const  UNPROTECTED_ROUTES: RouteName[]=[
    {method: 'GET', url: '/api/v1/user/getAllUsers'},
    {method: 'POST', url: '/api/v1/user/login'},
    {method: 'POST', url: '/api/v1/user/reset-password'},
    {method: 'POST', url: '/api/v1/user/renewLogin'},
  ]