import { RouteShorthandOptions } from "fastify";
import { IEventManagement } from "../../models/event";
import { DEFAULT_PAGE_SIZE } from "../../utils/config";

const EventManagementReqOpts = {
  type: "object",
  required: ["president", "treasurers", "vice_president", "vice_secretary"],
  properties: {
    president: { type: "string" },
    treasurers: { type: "array", items:{type:'string'} },
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
    status: string;
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
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
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
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        eventImages: {
          type: "array",
          items: { type: "string", format: "uri" },
        },
        status: { type: "string", enum: ["active", "ended", "inactive"] },
        startDate: { type: "number" },
        endDate: { type: "number" },
        eventManagement: EventManagementReqOpts,
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};

export interface UpdateEvent {
  Headers: {
    authorization: string;
  };
  Body: {
    eventId: string;
    name: string;
    description: string;
    status: string;
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
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["eventId"],
      properties: {
        eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        name: { type: "string" },
        description: { type: "string" },
        status: { type: "string", enum: ["active", "ended", "inactive"] },
        eventImages: {
          type: "array",
          items: { type: "string", format: "uri" },
        },
        startDate: { type: "number" },
        endDate: { type: "number" },
        eventManagement: EventManagementReqOpts,
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};
interface CreateExpense {
  Headers: {
    authorization: string;
  };
  Body: {
    eventId: string;
    name: string;
    description?: string;
    amount: number;
  };
}
interface UpdateExpense {
  Headers: {
    authorization: string;
  };
  Body: {
    id: string;
    name?: string;
    description?: string;
    amount?: number;
  };
}
const CreateExpenseReqOpts: RouteShorthandOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Events"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["name", "amount", "eventId"],
      properties: {
        eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        name: { type: "string" },
        description: { type: "string" },
        amount: { type: "number" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};
const UpdateExpenseReqOpts: RouteShorthandOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Events"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        name: { type: "string" },
        description: { type: "string" },
        amount: { type: "number" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};

interface AddCollection {
  Body: {
    eventId: string;
    amount: number;
    name: string;
  };
}
const AddCollectionReqOpts: RouteShorthandOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Events"],
    body: {
      type: "object",
      required: ["eventId", "amount", "name"],
      properties: {
        eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        amount: { type: "number" },
        name: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};
interface ApproveCollection {
  Headers: {
    authorization: string;
  };
  Querystring: {
    id: string;
    amountType:string
  };
}
const ApproveCollectionReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      required: ["id", "amountType"],
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        amountType: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
};

const GetAllEventsReqOpts: RouteShorthandOptions={
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Events"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string"},
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean" },
          data: { type: "array" },
        },
      },
    },
  },
}
export interface GetCollectionQuery {
  eventId: string;
  pageIndex: number;
  pageSize: number;
}
const GetCollectionReqOpts: RouteShorthandOptions = {
  schema: {
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    querystring: {
      type: "object",
      required: ["eventId"],
      properties: {
        eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        pageIndex: { type: "number", default: 0 },
        pageSize: { type: "number", default: DEFAULT_PAGE_SIZE }
      }
    },
    response: {
      200: {
        type: "object",
        required: ["success", "data","totalCount"],
        properties: {
          success: { type: "boolean" },
          data: { type: "array" },
          totalCount:{type:"number"},
          totalCollection:{type:"number"},
          currentUserCollection:{type:"number"},
        }
      }
    },
  },
};
export interface GetExpensesReq {
  Querystring: {
    eventId: string;
  };
}
const GetExpensesReqOpts = {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Events"],
    querystring: {
      type: "object",
      required: ["eventId"],
      properties: {
        eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "totalExpense", "currentUserExpense", "data"],
        properties: {
          success: { type: "boolean" },
          totalExpense: { type: "number" },
          currentUserExpense: { type: "number" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                eventId: { type: "string" },
                amount: { type: "number" },
                createdAt: { type: "string" },
                createdBy: { type: "string" },
                description: { type: "string" },
                approved:{type:'boolean'},
                approvedBy:{type:'string'},
              },
            },
          },
        },
      },
    },
  },
};

interface GetAllPendingAmounts{
  Querystring:{
    eventId:string,
  }
}
const GetAllPendingAmountReqOpts= {
  schema: {
    security: [{ bearerAuth: [] }],
    tags: ["Events"],
    querystring: {
      type: "object",
      required: ["eventId"],
      properties: {
        eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
      },
    },
    response: {
      200: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                eventId: { type: "string" },
                amount: { type: "number" },
                createdAt: { type: "string" },
                createdBy: { type: "string" },
                description: { type: "string" },
                amountType:{type: "string" }
              },
            },
          },
        },
      },
    },
  },
};
export {
  CreateEventReqOpts,
  UpdateEventReqOpts,
  CreateExpenseReqOpts,
  UpdateExpenseReqOpts,
  AddCollectionReqOpts,
  ApproveCollectionReqOpts,
  GetAllEventsReqOpts,
  GetCollectionReqOpts,
  GetExpensesReqOpts,
  GetAllPendingAmountReqOpts
};
export type { CreateExpense, UpdateExpense, AddCollection, ApproveCollection, GetAllPendingAmounts };
