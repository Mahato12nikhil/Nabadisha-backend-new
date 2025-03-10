import AutoLoad,{ AutoloadPluginOptions} from "@fastify/autoload";
import  { FastifyPluginAsync } from "fastify";
import FastifyMultipart from "@fastify/multipart";
import FastifyHelmet from '@fastify/helmet'
import FastifyCors from '@fastify/cors'
import FastifyCompress from '@fastify/compress'
import FastifyStatic from '@fastify/static'
import FastifySwagger from '@fastify/swagger'
import FastifySwaggerUI from '@fastify/swagger-ui'
import { API_ROUTE_PREFIX, RELATIVE_DIST_STATIC_FOLDER, SWAGGER_CONFIG_OPTS } from "./utils/config.js";
import { join } from "path"; 
//import { fileURLToPath } from "url";


//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

export type AppOptions = {
    isAwesomeApp: boolean;
  } & Partial<AutoloadPluginOptions>;
  
 const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
    // register multipart
    fastify.register(FastifyMultipart,{
        limits: {
          fileSize: 10 * 1024 * 1024, // For multipart forms, the max file size in bytes
        },
    });

    // register helmet
    fastify.register(FastifyHelmet);
    // register cors
    fastify.register(FastifyCors);
    // register compression
    fastify.register(FastifyCompress);
    // register static file serve
    fastify.register(FastifyStatic, {
        root: join(__dirname, RELATIVE_DIST_STATIC_FOLDER),
    });
    // register swagger plugin
    fastify.register(FastifySwagger,SWAGGER_CONFIG_OPTS);
   
    // Register Fastify Swagger UI Correctly
    fastify.register(FastifySwaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false,
        },
        staticCSP: true,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
    });
    // // This loads all plugins defined in routes
    fastify.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
        options: {...opts, prefix: API_ROUTE_PREFIX},
    });
      // This loads all plugins defined in plugins
      fastify.register(AutoLoad, {
        dir: join(__dirname, 'plugins'),
        options: opts,
    });
}
export default app;
export {app};