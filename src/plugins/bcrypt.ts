import fp from 'fastify-plugin'
import bcrypt from 'bcryptjs'

export default fp((fastify, opts)=>{
    fastify.decorate('encryptPassword', (password:string):string=>{
        try{
            const salt=bcrypt.genSaltSync(10);
            const hash=bcrypt.hashSync(password,salt);
            return hash;
        }
        catch(err){
            fastify.logToDb('encryptPassword','unknown error while hashing password.',{err}.toString());
            return ''
        }
    });
    fastify.addHook('preHandler', (request, reply, done) => {
        request.encryptPassword = fastify.encryptPassword;
        done();
    });
})

declare module 'fastify'{
    interface FastifyRequest{
        encryptPassword(password:string):string
    }
    interface FastifyInstance{
        encryptPassword(password:string):string
    }
}