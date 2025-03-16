import { RouteShorthandOptions } from "fastify";
import { IEventManagement } from "../../models/event";

const EventManagementReqOpts = {
  type: "object",
  required: ["president", "treasurer", "vice_president", "vice_secretary"],
  properties: {
    president: { type: "string" },
    treasurer: { type: "string" },
    secretary: { type: "string" },
    vice_president: { type: "string" },
    vice_secretary: { type: "string" },
  },
};
export interface CreateEvent {
  Headers: {
    authorization: string;
  };
  Body: {
    name: string;
    description: string;
    eventImages?: string[];
    startDate: number;
    endDate: number;
    status:string,
    eventManagement: IEventManagement;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    updatedBy: string;
  };
}

const CreateEventReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    headers:{
      type:'object',
      required:['authorization'],
      properties:{
        authorization: {type : "string"}
      }
    },
    body: {
      type: "object",
      required: [
        "name",
        "description",
        "status",
        "startDate",
        "endDate",
        "eventManagement",
      ],
      properties:{
        name: { type: "string" },
        description: { type: "string" },
        eventImages: { type: "array", items: { type: "string", format: "uri" } },
        status:{type:'string', enum: ["active", "ended", "inactive"]},
        startDate: { type: "number" },
        endDate: { type: "number" },
        eventManagement: EventManagementReqOpts ,
      }
    },
  },
};

export interface UpdateEvent {
    Headers: {
      authorization: string;
    };
    Body: {
      eventId:string,  
      name: string;
      description: string;
      status:string,
      eventImages?: string[];
      startDate: number;
      endDate: number;
      eventManagement: IEventManagement;
      updatedAt: number;
      updatedBy: string;
    };
  }

  const UpdateEventReqOpts: RouteShorthandOptions = {
    schema: {
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      headers:{
        type:'object',
        required:['authorization'],
        properties:{
          authorization: {type : "string"}
        }
      },
      body: {
        type: "object",
        required: [
          "eventId",
        ],
        properties:{
            eventId:{type:'string' , pattern: "^[a-fA-F0-9]{24}$"},
            name: { type: "string" },
            description: { type: "string" },
            status:{type:'string', enum: ["active", "ended", "inactive"]},
            eventImages: { type: "array", items: { type: "string", format: "uri" } },
            startDate: { type: "number" },
            endDate: { type: "number" },
            eventManagement: EventManagementReqOpts ,
        }
      },
    },
  };
  interface CreateExpense {
    Headers: {
      authorization: string;
    },
    Body:{
      eventId:string,
      name: string,
      description?:string,
      amount:number
    }
  }
  interface UpdateExpense{
    Headers: {
      authorization: string;
    };
    Body:{
      id:string,
      name?:string,
      description?:string,
      amount?:number
    }
  }
  const CreateExpenseReqOpts: RouteShorthandOptions={
    schema:{
      security:[{bearerAuth:[]}],
      tags:['Events'],
      headers:{
        type:'object',
        required:['authorization'],
        properties:{
          authorization: {type : "string"}
        }
      },
      body:{
        type:'object',
        required:['name', 'amount'],
        properties:{
          eventId:{type:'string', pattern: "^[a-fA-F0-9]{24}$"},
          name:{type:'string'},
          description:{type:'string'},
          amount:{type:'number'}
        }
      }
    }
  }
  const UpdateExpenseReqOpts: RouteShorthandOptions={
    schema:{
      security:[{bearerAuth:[]}],
      tags:['Events'],
      headers:{
        type:'object',
        required:['authorization'],
        properties:{
          authorization: {type : "string"}
        }
      },
      body:{
        type:'object',
        required:['id'],
        properties:{
          id:{type:'string', pattern: "^[a-fA-F0-9]{24}$"},
          name:{type:'string'},
          description:{type:'string'},
          amount:{type:'number'}
        }
      }
    }
  }

export { CreateEventReqOpts, UpdateEventReqOpts, CreateExpenseReqOpts, UpdateExpenseReqOpts };
export type {CreateExpense, UpdateExpense}
