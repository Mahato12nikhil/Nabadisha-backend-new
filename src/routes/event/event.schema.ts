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
    body: {
      type: "object",
      required: [
        "name",
        "description",
        "startDate",
        "endDate",
        "eventManagement",
      ],
      name: { type: "string" },
      description: { type: "string" },
      eventImages: { type: "array", items: { type: "string", format: "uri" } },
      startDate: { type: "number" },
      endDate: { type: "number" },
      eventManagement: EventManagementReqOpts ,
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
      body: {
        type: "object",
        required: [
          "eventId",
        ],
        eventId:{type:'string' , pattern: "^[a-fA-F0-9]{24}$"},
        name: { type: "string" },
        description: { type: "string" },
        eventImages: { type: "array", items: { type: "string", format: "uri" } },
        startDate: { type: "number" },
        endDate: { type: "number" },
        eventManagement: EventManagementReqOpts ,
      },
    },
  };
  
  
export { CreateEventReqOpts, UpdateEventReqOpts };
