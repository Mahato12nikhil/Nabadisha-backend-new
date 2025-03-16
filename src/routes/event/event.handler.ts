import { FastifyReply, FastifyRequest } from "fastify";
import { CreateEvent, CreateExpense, UpdateEvent, UpdateExpense } from "./event.schema";
import { COLL_EVENTS, COLL_EXPENSES } from "../../utils/constants";
import { ObjectId } from "@fastify/mongodb";

type CrtEvntRequest = FastifyRequest<CreateEvent>;
const DB = process.env.DB_NAME;

const CreateEventHandler = async(request: CrtEvntRequest, reply: FastifyReply) => {
  try {

    if(request.user && request.user.role!=='admin'){
        return reply.status(401).send({
            success:false,
            message:'user has no access for this operation.'
        })
    }
    const {name, description, startDate, endDate, status, eventManagement, eventImages}=request.body;
    const timestamp=request.getCurrentTimestamp();
    
    const eventImg=eventImages?eventImages:[]
    
    const doc={
        name,
        description,
        startDate,
        endDate,
        status,
        eventManagement,
        eventImages:eventImg,
        createdAt:timestamp,
        updatedAt:timestamp,
        createdBy:request.user.username,
        updatedBy:request.user.username
    }
    const collEvents=request.mongo.client.db(DB).collection(COLL_EVENTS);

    if(!collEvents){
        return reply.status(500).send({
            success:false,
            message:'database error'
        })
    }
    const result=await collEvents.insertOne(doc);
   
    if(result?.acknowledged){
        return reply.send({
            success:true,
            message:'Event created successfully.'
        })
    }

  } catch (err) {
    return reply.send({
      success: false,
      message: "Internal server error",
    });
  }
};

type UpdtEvntRequest=FastifyRequest<UpdateEvent>
const UpdateEventHandler = async (request: UpdtEvntRequest, reply: FastifyReply) => {
  try {
    if (!request.user || request.user.role !== "admin") {
      return reply.status(401).send({
        success: false,
        message: "User has no access for this operation.",
      });
    }

    const { eventId, name, status,description, startDate, endDate, eventManagement, eventImages } = request.body;

    if (!eventId || !ObjectId.isValid(eventId)) {
      return reply.status(400).send({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const timestamp = request.getCurrentTimestamp();
    
    const updateFields: Partial<UpdateEvent["Body"]> = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (startDate !== undefined) updateFields.startDate = startDate;
    if (endDate !== undefined) updateFields.endDate = endDate;
    if (eventManagement !== undefined) updateFields.eventManagement = eventManagement;
    if (eventImages !== undefined) updateFields.eventImages = eventImages;

    if (Object.keys(updateFields).length === 0) {
      return reply.status(400).send({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    updateFields.updatedAt = timestamp;
    updateFields.updatedBy = request.user.username;

    const collEvents = request.mongo.client.db(DB).collection(COLL_EVENTS);
    const result = await collEvents.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return reply.status(404).send({
        success: false,
        message: "Event not found.",
      });
    }

    if (result.modifiedCount > 0) {
      return reply.send({
        success: true,
        message: "Event updated successfully.",
      });
    } else {
      return reply.send({
        success: true,
        message: "No changes made to the event.",
      });
    }

  } catch (err:any) {
    console.error("Error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
type CrtExpnsReq=FastifyRequest<CreateExpense>;

const CreateExpenseHandler=async(request: CrtExpnsReq, reply: FastifyReply)=>{

  try{
    const collEvents=request?.mongo.client.db(DB).collection(COLL_EVENTS);
    const collExpenses=request?.mongo.client.db(DB).collection(COLL_EXPENSES);
  
    const {eventId, name, description, amount} = request.body;
    const event=await collEvents.findOne({_id: new ObjectId(eventId)});
  
    if(!event){
      return reply.status(404).send({
        success:false,
        message:'not a valid event.'
      })
    };
    const timestamp=request.getCurrentTimestamp();
    let doc={
      name,
      eventId: new ObjectId(eventId),
      amount,
      createdAt:timestamp,
      createdBy:request?.user.username,
      ...(description && { description })
    }
  
    const result=await collExpenses.insertOne(doc);
    if(result.acknowledged){
      return reply.status(200).send({
        success:true,
        message:'expense created successfully'
      })
    }
  }catch(err){
    return reply.status(500).send({
      success:false,
      message:'Internal server error'
    })
  }
} 

type UpdtExpnsReq=FastifyRequest<UpdateExpense>;

const UpdateExpenseHandler=async(request: UpdtExpnsReq, reply: FastifyReply)=>{

  try{
    const collEvents=request?.mongo.client.db(DB).collection(COLL_EVENTS);
    const collExpenses=request?.mongo.client.db(DB).collection(COLL_EXPENSES);
  
    const {id, name, description, amount} = request.body;
    const event=await collEvents.findOne({_id: new ObjectId(id)});
  
    if(!event){
      return reply.status(404).send({
        success:false,
        message:'not a valid record.'
      })
    };
    const timestamp=request.getCurrentTimestamp();
    let doc : Partial<UpdateExpense['Body']> & {updatedAt:number, updatedBy: string }={
      updatedAt:timestamp,
      updatedBy:request.user.username
    };

    if(name) doc.name=name;
    if(description) doc.description=description;
    if(amount) doc.amount=amount;
    
    const result=await collExpenses.updateOne({_id: new ObjectId(id)}, {$set: doc});
    if (result.modifiedCount > 0) {
      return reply.send({
        success: true,
        message: "Event updated successfully.",
      });
    } else {
      return reply.send({
        success: true,
        message: "No changes made to the event.",
      });
    }
  }catch(err){
    return reply.status(500).send({
      success:false,
      message:'Internal server error'
    })
  }
} 
export { CreateEventHandler, UpdateEventHandler, CreateExpenseHandler, UpdateExpenseHandler };
