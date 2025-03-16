import { FastifyPluginAsync } from "fastify";
import { CreateEvent, CreateEventReqOpts, CreateExpense, CreateExpenseReqOpts, UpdateEvent, UpdateEventReqOpts, UpdateExpense, UpdateExpenseReqOpts } from "./event.schema";
import { CreateEventHandler, CreateExpenseHandler, UpdateEventHandler, UpdateExpenseHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.put<UpdateEvent>('/update-event',UpdateEventReqOpts, UpdateEventHandler);
    fastify.post<CreateExpense>('/create-expense',CreateExpenseReqOpts, CreateExpenseHandler);
    fastify.put<UpdateExpense>('/update-expense',UpdateExpenseReqOpts, UpdateExpenseHandler);
}
export default eventRoute;