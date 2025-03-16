import { FastifyPluginAsync } from "fastify";
import { AddCollection, AddCollectionReqOpts, CreateEvent, CreateEventReqOpts, CreateExpense, CreateExpenseReqOpts, UpdateEvent, UpdateEventReqOpts, UpdateExpense, UpdateExpenseReqOpts } from "./event.schema";
import { AddCollectionHandler, CreateEventHandler, CreateExpenseHandler, GetEventHandler, UpdateEventHandler, UpdateExpenseHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.get('/getAllActiveEvents',{schema:{tags:['Events']}}, GetEventHandler);
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.put<UpdateEvent>('/update-event',UpdateEventReqOpts, UpdateEventHandler);
    fastify.post<CreateExpense>('/create-expense',CreateExpenseReqOpts, CreateExpenseHandler);
    fastify.put<UpdateExpense>('/update-expense',UpdateExpenseReqOpts, UpdateExpenseHandler);
    fastify.post<AddCollection>('/add-collection',AddCollectionReqOpts, AddCollectionHandler);
}
export default eventRoute;