import { FastifyPluginAsync } from "fastify";
import { CreateEvent, CreateEventReqOpts, CreateExpense, CreateExpenseReqOpts, UpdateEvent, UpdateEventReqOpts } from "./event.schema";
import { CreateEventHandler, CreateExpenseHandler, UpdateEventHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.post<UpdateEvent>('/update-event',UpdateEventReqOpts, UpdateEventHandler);
    fastify.post<CreateExpense>('/create-expense',CreateExpenseReqOpts, CreateExpenseHandler);

}
export default eventRoute;