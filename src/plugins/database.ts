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
    // request.getSequenceNextVal = fastify.getSequenceNextVal;
    done();
  });
//   fastify.decorate('getSequenceNextVal',async(sequenceId:string)=>{
//     const result = await fastify.mongo.client.db(process.env.DB_PORTFOLIO)
//     ?.collection<SequenceSchema>(COLL_SEQUENCES)
//     .findOneAndUpdate(
//       {_id: sequenceId},
//       {$inc: {val: 1}},
//       {upsert: true, returnDocument: 'after'},
//     );
//     if (result?.val) {
//       return result.val;
//     }
//     throw new Error('not able to get next sequence value');
//     })
  });

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyRequest {
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    //getSequenceNextVal: (sequenceId: string) => Promise<number>;
  }
  export interface FastifyInstance {
   // getSequenceNextVal(sequenceId: string): Promise<number>;
  }
}