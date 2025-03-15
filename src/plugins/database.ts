import fp from 'fastify-plugin';
import FastifyMongodb, {FastifyMongoNestedObject, FastifyMongoObject} from '@fastify/mongodb';

export default fp(async (fastify, opts) => {
    const dbConnUrl = process.env.DB_URL;
    if (!dbConnUrl) {
      throw new Error('DB_CONN_URL not found.');
    }

    fastify.register(FastifyMongodb, {
      forceClose: true,
      url: dbConnUrl,
    });

    fastify.addHook('preHandler', (request, reply, done) => {
      request.mongo = fastify.mongo;
      request.logToDb=fastify.logToDb;
      // request.getSequenceNextVal = fastify.getSequenceNextVal;
      done();
    });

    //loggin to mongoDb
    fastify.decorate('logToDb',async(label?:string, message?:string, metadata?:string)=>{
      
      if (!label && !message && !metadata) {
        return; 
      }
     
      const log={
        label,
        message,
        metadata,
        timestamp:new Date().getTime()
      }

      try{
        await fastify.mongo.client.db(process.env.DB_NAME).collection('logs').insertOne(log);
      }
      catch(err){
        console.log('failed to update log to database')
      }
    })
  });

declare module 'fastify' {
  export interface FastifyRequest {
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    logToDb(label?: string, message?: string, metadata?: string):void;
  }
  export interface FastifyInstance {
    logToDb(label?: string, message?: string, metadata?: string):void;
  }
}