import { FastifyPluginAsync } from "fastify";
import { CreateEvent, CreateEventReqOpts, UpdateEvent, UpdateEventReqOpts } from "./event.schema";
import { CreateEventHandler, UpdateEventHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.post<UpdateEvent>('/update-event',UpdateEventReqOpts, UpdateEventHandler)

}
export default eventRoute;