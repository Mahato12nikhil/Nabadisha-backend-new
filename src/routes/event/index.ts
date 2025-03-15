import { FastifyPluginAsync } from "fastify";
import { CreateEvent, CreateEventReqOpts, UpdateEvent, UpdateEventReqOpts } from "./event.schema";
import { CreateEventHandler, UpdateEventHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify)=>{
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.post<UpdateEvent>('/create-event',UpdateEventReqOpts, UpdateEventHandler)

}
export  {eventRoute};