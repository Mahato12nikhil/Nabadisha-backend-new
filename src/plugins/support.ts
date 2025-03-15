import fp from 'fastify-plugin';
import {DEFAULT_PAGE_SIZE} from '../utils/config';

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  // decorator function to get current unix timestamp
  fastify.decorate('getCurrentTimestamp', (): number => {
    return new Date().getTime();
  });

  // decorator function to get default page size
  fastify.decorate('getDefaultPageSize', (): number => {
    return DEFAULT_PAGE_SIZE;
  });

  fastify.addHook('preHandler', (request, reply, done) => {
    request.getCurrentTimestamp = fastify.getCurrentTimestamp;
    request.getDefaultPageSize = fastify.getDefaultPageSize;
    done();
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentTimestamp(): number;
    getDefaultPageSize(): number;
  }
  export interface FastifyInstance {
    getCurrentTimestamp(): number;
    getDefaultPageSize(): number;
  }
}
