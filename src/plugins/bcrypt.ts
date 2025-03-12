import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import bcrypt from 'bcryptjs'

export default fp((fastify: FastifyInstance, opts)=>{
    fastify.decorate('encryptPassword', (password:string):string=>{
        try{
            const salt=bcrypt.genSaltSync(10);
            const hash=bcrypt.hashSync(password,salt);
            return hash;
        }
        catch(err){
            fastify.logToDb('encryptPassword','unknown error while hashing password.',{err});
            return ''
        }
    });
})

declare module 'fastify'{
    interface FastifyRequest{
        encryptPassword(password:string):string
    }
}