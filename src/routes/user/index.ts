import fp from 'fastify-plugin'
import { CreateUser, CreateUserOpts, GetAllUsersOpts } from './user.schema'
import { CreateUserHandler, GetAllUsershandler } from './user.handler'


export default fp((fastify, opts)=>{
    fastify.get('/getAllUsers', GetAllUsersOpts, GetAllUsershandler);
    fastify.post<CreateUser>('/createUser', CreateUserOpts, CreateUserHandler)
})