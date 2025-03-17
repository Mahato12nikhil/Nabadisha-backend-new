import { CreateUser, CreateUserOpts, GetAllUsersOpts, Login, LoginReqOpts, ResetPassword, ResetPasswordReqOpts, UpdateUser, UpdateUserOpts, UpdateUserRole, UpdateUserRoleReqOpt } from './user.schema'
import { CreateUserHandler, GetAllUsershandler, LoginHandler, ResetPasswordHandler, UpdateUserHandler, UpdateUserRoleHandler } from './user.handler'
import { FastifyPluginAsync } from 'fastify';


const userRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.get('/getAllUsers', GetAllUsersOpts, GetAllUsershandler);
    fastify.post<CreateUser>('/createUser', CreateUserOpts, CreateUserHandler);
    fastify.put<UpdateUser>('/updateUser', UpdateUserOpts, UpdateUserHandler);
    fastify.post<UpdateUserRole>('/updateUserRole', UpdateUserRoleReqOpt,UpdateUserRoleHandler);
    fastify.post<Login>('/login',LoginReqOpts, LoginHandler);
    fastify.post<ResetPassword>('/reset-password',ResetPasswordReqOpts, ResetPasswordHandler);

};
export default userRoute;