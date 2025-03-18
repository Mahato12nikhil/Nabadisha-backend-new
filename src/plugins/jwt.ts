import { fastifyJwt } from '@fastify/jwt';
import fp from 'fastify-plugin'
import { API_ROUTE_PREFIX, REFRESH_TOKEN_EXPIRY, TOKEN_EXPIRY, UNPROTECTED_ROUTES } from '../utils/config';

export default fp(async(fastify, opts)=>{
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT_SECRET_KEY not found.');
    }
  
    fastify.register(fastifyJwt, {secret});
    fastify.decorate('authenticate',async (req, reply)=>{
        try {
            await req.jwtVerify();
          } catch (err) {
            reply.send(err);
          }
    });

    fastify.addHook('onRequest',async(req, reply)=>{
        const {routeOptions, method}=req;
        let url=routeOptions.url;   

        url=url?.endsWith('/')?url.slice(0,-1):url;

        if(url?.startsWith(API_ROUTE_PREFIX)){
          const route = UNPROTECTED_ROUTES.find((e) => e.method === method && e.url === url);
          if (!route) {
            await fastify.authenticate(req, reply);
          }
        }
    })
    fastify.decorate('generateToken',(username, roles)=>{
      try{const token=fastify.jwt.sign({username,roles}, {expiresIn: TOKEN_EXPIRY});
        return token;
      }
      catch(err){
       fastify.logToDb('token','failed to generate token--->'+err);
       return '';
      }
    });

    fastify.decorate('generateRefreshToken',(username)=>{
      try{const token=fastify.jwt.sign({username}, {expiresIn: REFRESH_TOKEN_EXPIRY});
        return token;
      }
      catch(err){
       fastify.logToDb('token','failed to generate refreshToken--->'+err);
       return '';
      }
    });

    fastify.decorate('validateRefreshToken', (refreshToken: string): string => {
      try {
        const payload = fastify.jwt.verify<{username: string}>(refreshToken);
        if (!payload || !payload.username) {
          console.log("username: "+payload.username)
          throw new Error('not valid refresh token');
        }
        return payload.username;
      } catch (err) {
        fastify.log.error(err);
        return "";
      }
    });

    fastify.addHook('preHandler', (request, reply, done) => {
      request.generateToken = fastify.generateToken;
      request.generateRefreshToken = fastify.generateRefreshToken;
      request.getUserNameFromToken = fastify.getUserNameFromToken;
      request.validateRefreshToken=fastify.validateRefreshToken;
      done();
    });
});


export interface JWTPayload{
    username:string,
    roles?:string[]
}
declare module '@fastify/jwt' {
    interface FastifyJWT {
      payload: JWTPayload;
      user: JWTPayload;
    }
}
declare module 'fastify'{
    export interface FastifyRequest{
      generateToken(username: string, roles:string[]): string;
      generateRefreshToken(username: string): string;
      getUserNameFromToken(token: string): string;
      validateRefreshToken(refreshToken:string):string
    }
    export interface FastifyInstance {
      authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
      generateToken(username: string, roles:string[]): string ;
      generateRefreshToken(username: string): string;
      getUserNameFromToken(token: string): string;
      validateRefreshToken(refreshToken:string):string
    }
  }