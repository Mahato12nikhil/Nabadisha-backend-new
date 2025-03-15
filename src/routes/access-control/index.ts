import { FastifyPluginAsync } from "fastify";
import { CreatePermission, CreatePermissionReqOpts, CreateRole, CreateRoleOpts } from "./access-control.schema";
import { CreatePermissionHandler, CreateRoleHandler } from "./access-control.handler";

const accessRoute: FastifyPluginAsync=async(fastify)=>{
    fastify.post<CreateRole>('/create-role',CreateRoleOpts,CreateRoleHandler);
    fastify.post<CreatePermission>('/create-permission',CreatePermissionReqOpts,CreatePermissionHandler)

}
export default accessRoute;