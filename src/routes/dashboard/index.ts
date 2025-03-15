import { PostDashMenuHandler } from './dashboard.handler';
import { PostDashMenuReq, PostDashQuery } from './dashboard.schema';
import { FastifyPluginAsync } from 'fastify';

const dashRoute: FastifyPluginAsync=(async(fastify, opts)=>{
    fastify.post<PostDashQuery>('/dashmenu',PostDashMenuReq, PostDashMenuHandler);
});
export default dashRoute;