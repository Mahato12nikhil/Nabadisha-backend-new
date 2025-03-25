import { FastifyPluginAsync } from "fastify";
import { AddCollection, AddCollectionReqOpts, ApproveCollection, ApproveCollectionReqOpts, CreateEvent, CreateEventReqOpts, CreateExpense, CreateExpenseReqOpts, GetAllEventsReqOpts, GetAllPendingAmountReqOpts, GetCollectionQuery, GetCollectionReqOpts, GetExpensesReqOpts, UpdateEvent, UpdateEventReqOpts, UpdateExpense, UpdateExpenseReqOpts } from "./event.schema";
import { AddCollectionHandler, ApproveAmountHandler, CreateEventHandler, CreateExpenseHandler, GetAllCollectionHandler, GetAllEventsHandler, GetAllExpensesHandler, GetAllPendingAmountHandler, GetEventHandler, UpdateEventHandler, UpdateExpenseHandler } from "./event.handler";

const eventRoute: FastifyPluginAsync=async(fastify, opts)=>{
    fastify.get('/getAllActiveEvents',{schema:{tags:['Events']}}, GetEventHandler);
    fastify.post<CreateEvent>('/create-event',CreateEventReqOpts, CreateEventHandler);
    fastify.put<UpdateEvent>('/update-event',UpdateEventReqOpts, UpdateEventHandler);
    fastify.get('/getAllEvents',GetAllEventsReqOpts, GetAllEventsHandler);
    fastify.post<CreateExpense>('/create-expense',CreateExpenseReqOpts, CreateExpenseHandler);
    fastify.put<UpdateExpense>('/update-expense',UpdateExpenseReqOpts, UpdateExpenseHandler);
    fastify.post<AddCollection>('/add-collection',AddCollectionReqOpts, AddCollectionHandler);
    fastify.get<ApproveCollection>('/approvals/approveAmounts',ApproveCollectionReqOpts,ApproveAmountHandler);
    fastify.get<{ Querystring: GetCollectionQuery }>('/get-collections',GetCollectionReqOpts,GetAllCollectionHandler);
    fastify.get('/getAllExpenses',GetExpensesReqOpts, GetAllExpensesHandler);
    fastify.get('/approvals/pendingAmounts', GetAllPendingAmountReqOpts, GetAllPendingAmountHandler)
}
export default eventRoute;