import { FastifyPluginAsync } from "fastify";
import { AddCollection, AddCollectionReqOpts, ApproveCollection, ApproveCollectionReqOpts, CreateEvent, CreateEventReqOpts, CreateExpense, CreateExpenseReqOpts, GetAllEventsReqOpts, GetCollectionQuery, GetCollectionReqOpts, UpdateEvent, UpdateEventReqOpts, UpdateExpense, UpdateExpenseReqOpts } from "./event.schema";
import { AddCollectionHandler, ApproveCollectionHandler, CreateEventHandler, CreateExpenseHandler, GetAllCollectionHandler, GetAllEventsHandler, GetEventHandler, UpdateEventHandler, UpdateExpenseHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.get('/getAllActiveEvents',{schema:{tags:['Events']}}, GetEventHandler);
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.put<UpdateEvent>('/update-event',UpdateEventReqOpts, UpdateEventHandler);
    fastify.get('/getAllEvents',GetAllEventsReqOpts, GetAllEventsHandler);
    fastify.post<CreateExpense>('/create-expense',CreateExpenseReqOpts, CreateExpenseHandler);
    fastify.put<UpdateExpense>('/update-expense',UpdateExpenseReqOpts, UpdateExpenseHandler);
    fastify.post<AddCollection>('/add-collection',AddCollectionReqOpts, AddCollectionHandler);
    fastify.post<ApproveCollection>('/approve-collection/:collectionId',ApproveCollectionReqOpts,ApproveCollectionHandler);
    fastify.get<{ Querystring: GetCollectionQuery }>('/get-collections',GetCollectionReqOpts,GetAllCollectionHandler);

}
export default eventRoute;