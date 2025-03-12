import { CreateUser, CreateUserOpts, GetAllUsersOpts, UpdateUser, UpdateUserOpts, UpdateUserRole, UpdateUserRoleReqOpt } from './user.schema'
import { CreateUserHandler, GetAllUsershandler, UpdateUserHandler, UpdateUserRoleHandler } from './user.handler'
import { FastifyPluginAsync } from 'fastify';


const userRoute: FastifyPluginAsync=(async(fastify, opts)=>{
    fastify.get('/getAllUsers', GetAllUsersOpts, GetAllUsershandler);
    fastify.post<CreateUser>('/createUser', CreateUserOpts, CreateUserHandler);
    fastify.put<UpdateUser>('/updateUser', UpdateUserOpts, UpdateUserHandler);
    fastify.post<UpdateUserRole>('/updateUserRole', UpdateUserRoleReqOpt,UpdateUserRoleHandler);
});
export default userRoute;