import { FastifyReply, FastifyRequest } from "fastify";
import {
  AddCollection,
  ApproveCollection,
  CreateEvent,
  CreateExpense,
  GetAllPendingAmounts,
  GetCollectionQuery,
  GetExpensesReq,
  UpdateEvent,
  UpdateExpense,
} from "./event.schema";
import {
  COLL_CONTRIBUTORS,
  COLL_EVENTS,
  COLL_EXPENSES,
  EventStatus,
  FIELD_COLLECTION,
  FIELD_EXPENSE,
} from "../../utils/constants";
import { ObjectId } from "@fastify/mongodb";
import { IEvent } from "../../models/event";

type CrtEvntRequest = FastifyRequest<CreateEvent>;
const DB = process.env.DB_NAME;

const CreateEventHandler = async (
  request: CrtEvntRequest,
  reply: FastifyReply
) => {
  try {
    if (request.user && request.user.roles?.indexOf("admin") === -1) {
      return reply.status(401).send({
        success: false,
        message: "user has no access for this operation.",
      });
    }
    const {
      name,
      description,
      startDate,
      endDate,
      status,
      eventManagement,
      eventImages,
    } = request.body;
    const timestamp = request.getCurrentTimestamp();

    const eventImg = eventImages ? eventImages : [];

    const doc = {
      name,
      description,
      startDate,
      endDate,
      status,
      eventManagement,
      eventImages: eventImg,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: request.user.username,
      updatedBy: request.user.username,
    };
    const collEvents = request.mongo.client.db(DB).collection(COLL_EVENTS);

    if (!collEvents) {
      return reply.status(500).send({
        success: false,
        message: "database error",
      });
    }
    const result = await collEvents.insertOne(doc);

    if (result?.acknowledged) {
      return reply.send({
        success: true,
        message: "Event created successfully.",
      });
    }
  } catch (err) {
    return reply.send({
      success: false,
      message: "Internal server error",
    });
  }
};

type UpdtEvntRequest = FastifyRequest<UpdateEvent>;
const UpdateEventHandler = async (
  request: UpdtEvntRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user.roles?.indexOf("admin") !== -1) {
      return reply.status(401).send({
        success: false,
        message: "User has no access for this operation.",
      });
    }

    const {
      eventId,
      name,
      status,
      description,
      startDate,
      endDate,
      eventManagement,
      eventImages,
    } = request.body;

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
    if (eventManagement !== undefined)
      updateFields.eventManagement = eventManagement;
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
  } catch (err: any) {
    console.error("Error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
type CrtExpnsReq = FastifyRequest<CreateExpense>;

const CreateExpenseHandler = async (
  request: CrtExpnsReq,
  reply: FastifyReply
) => {
  try {
    const collEvents = request?.mongo.client.db(DB).collection(COLL_EVENTS);
    const collExpenses = request?.mongo.client.db(DB).collection(COLL_EXPENSES);

    const { eventId, name, description, amount } = request.body;
    const event = await collEvents.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return reply.status(404).send({
        success: false,
        message: "not a valid event.",
      });
    }
    const timestamp = request.getCurrentTimestamp();
    let doc = {
      name,
      eventId: new ObjectId(eventId),
      amount,
      approved:false,
      createdAt: timestamp,
      createdBy: request?.user.username,
      ...(description && { description }),
    };

    const result = await collExpenses.insertOne(doc);
    if (result.acknowledged) {
      return reply.status(200).send({
        success: true,
        message: "expense created successfully",
      });
    }
  } catch (err) {
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

type UpdtExpnsReq = FastifyRequest<UpdateExpense>;

const UpdateExpenseHandler = async (
  request: UpdtExpnsReq,
  reply: FastifyReply
) => {
  try {
    const collEvents = request?.mongo.client.db(DB).collection(COLL_EVENTS);
    const collExpenses = request?.mongo.client.db(DB).collection(COLL_EXPENSES);

    const { id, name, description, amount } = request.body;
    const event = await collEvents.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return reply.status(404).send({
        success: false,
        message: "not a valid record.",
      });
    }
    const timestamp = request.getCurrentTimestamp();
    let doc: Partial<UpdateExpense["Body"]> & {
      updatedAt: number;
      updatedBy: string;
    } = {
      updatedAt: timestamp,
      updatedBy: request.user.username,
    };

    if (name) doc.name = name;
    if (description) doc.description = description;
    if (amount) doc.amount = amount;

    const result = await collExpenses.updateOne(
      { _id: new ObjectId(id) },
      { $set: doc }
    );
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
  } catch (err) {
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
const GetEventHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const collEvents = request.mongo.client.db(DB).collection(COLL_EVENTS);

    const status: EventStatus = "active";
    const result = await collEvents.find({ status }).toArray();

    if (result.length === 0) {
      return reply.status(404).send({
        success: false,
        message: "No events found.",
      });
    }

    return reply.status(200).send({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

type AddCllctionReq = FastifyRequest<AddCollection>;

const AddCollectionHandler = async (
  request: AddCllctionReq,
  reply: FastifyReply
) => {
  try {
    const collContributors = request?.mongo.client
      .db(DB)
      .collection(COLL_CONTRIBUTORS);
    const collEvents = request?.mongo.client.db(DB).collection(COLL_EVENTS);

    const { eventId, name, amount } = request.body;
    const event = await collEvents.findOne<IEvent>({
      _id: new ObjectId(eventId),
    });

    if (!event) {
      return reply.status(404).send({
        success: false,
        message: "not a valid event.",
      });
    }

    const timestamp = request.getCurrentTimestamp();
    let doc = {
      eventId : new ObjectId(eventId),
      amount,
      name,
      approved: false,
      createdAt: timestamp,
      createdBy: request?.user.username,
    };

    const result = await collContributors.insertOne(doc);
    if (result.acknowledged) {
      return reply.status(200).send({
        success: true,
        message: "collection added successfully",
      });
    } else {
      return reply.status(500).send({
        success: false,
        message: "database error",
      });
    }
  } catch (err) {
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

type ApprvClltionReq = FastifyRequest<ApproveCollection>;

const ApproveAmountHandler = async (
  request: ApprvClltionReq,
  reply: FastifyReply
) => {
  try {
    const db = request.mongo.client.db(DB);
    const collContributors = db.collection(COLL_CONTRIBUTORS);
    const collExpenses = db.collection(COLL_EXPENSES);
    const collEvents = db.collection(COLL_EVENTS);

    const { id, amountType } = request.query;

    let eventObjectId: string | null = null;

    if (amountType === FIELD_COLLECTION) {
      const contributor = await collContributors.findOne({ _id: new ObjectId(id) });
      if (!contributor) {
        return reply.status(404).send({
          success: false,
          message: "Collection details not found.",
        });
      }
      eventObjectId = contributor.eventId; 
    } else if (amountType === FIELD_EXPENSE) {
      const expense = await collExpenses.findOne({ _id: new ObjectId(id) });
      if (!expense) {
        return reply.status(404).send({
          success: false,
          message: "Expense details not found.",
        });
      }
      eventObjectId = expense.eventId; 
    }

    if (!eventObjectId) {
      return reply.status(400).send({
        success: false,
        message: "Event ID not associated with this record.",
      });
    }

    // Fetch event details
    const event = await collEvents.findOne({ _id: new ObjectId(eventObjectId) });
    if (!event) {
      return reply.status(404).send({
        success: false,
        message: "Associated event not found.",
      });
    }

    const roles = request.user.roles || [];
    const treasurers = event.eventManagement?.treasurers || [];

    // Authorization check
    if (!treasurers.includes(request.user.username) && !roles.includes("admin")) {
      return reply.status(401).send({
        success: false,
        message: "You are not authorized to approve this.",
      });
    }

    const approvedBy = request.user.username;
    const timestamp = request.getCurrentTimestamp();

    const updateDoc = {
      approved: true,
      approvedBy,
      updatedAt: timestamp,
      updatedBy: approvedBy,
    };

    // Choose correct collection to update
    const targetCollection = amountType === FIELD_COLLECTION ? collContributors : collExpenses;

    const result = await targetCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.modifiedCount > 0) {
      return reply.status(200).send({
        success: true,
        message: "Approved successfully",
      });
    } else {
      return reply.status(400).send({
        success: false,
        message: "Approval failed. No changes were made.",
      });
    }
  } catch (err) {
    console.error("Error in ApproveAmountHandler:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};



const GetAllEventsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const collEvents = request.mongo.client.db(DB).collection(COLL_EVENTS);
    
    const result = await collEvents.find({ status: { $in: ["active", "ended"] } }).toArray();

    if (result.length === 0) {
      return reply.status(404).send({
        success: false,
        message: "No events found.",
      });
    }

    return reply.status(200).send({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error fetching all events:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetAllCollectionHandler = async (
  request: FastifyRequest<{ Querystring: GetCollectionQuery }>,
  reply: FastifyReply
) => {
  try {
    const { eventId } = request.query;
    //paging is disabled as of now
    // const skip = Number(pageIndex) * Number(pageSize);
    // const limit = Number(pageSize);

    const collContributors = request.mongo.client.db(process.env.DB_NAME!).collection(COLL_CONTRIBUTORS);

    const query = {
      eventId: new ObjectId(eventId),
      $or: [
        { approved: true },
        { createdBy: request.user.username },
      ],
    };

    const [totalCount, data] = await Promise.all([
      collContributors.countDocuments(query),
      //collContributors.find(query).sort({ $natural: -1 }).skip(skip).limit(limit).toArray()
      //for now paging is disabled, later it will be taken care of
      collContributors.find(query).sort({ $natural: -1 }).toArray(),
    ]);
    const totalsAgg = await collContributors
    .aggregate([
      { $match: {eventId: new ObjectId(eventId), approved:true}},
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$amount" },
          currentUserCollection: {
            $sum: {
              $cond: [
                { $eq: ["$createdBy", request.user.username] },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ])
    .toArray();

  const totalCollection = totalsAgg[0]?.totalCollection || 0;
  const currentUserCollection = totalsAgg[0]?.currentUserCollection || 0;

    return reply.send({
      success: true,
      data,
      totalCount,
      totalCollection,
      currentUserCollection
    });
  } catch (err) {
    console.error("Error fetching collections:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetAllExpensesHandler = async (
  request: FastifyRequest<GetExpensesReq>,
  reply: FastifyReply
) => {
  try {
    const collExpenses = request?.mongo.client.db(DB).collection(COLL_EXPENSES);
    const { eventId } = request.query;

    const eventObjectId = new ObjectId(eventId);
    
    // Fetch all expenses for the event
    const expenses = await collExpenses.find({ eventId: eventObjectId }).toArray();
    
    // Calculate total expense and current user's expenses
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const currentUserExpense = expenses
      .filter((exp) => exp.createdBy === request.user.username)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return reply.status(200).send({
      success: true,
      totalExpense,
      currentUserExpense,
      data: expenses,
    });
  } catch (err) {
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetAllPendingAmountHandler = async (
  request: FastifyRequest<GetAllPendingAmounts>,
  reply: FastifyReply
) => {
  try {
    const { eventId } = request.query;
    if (!eventId) {
      return reply.status(400).send({ success: false, message: "Event ID is required." });
    }

    let eventObjectId;
    try {
      eventObjectId = new ObjectId(eventId);
    } catch (error) {
      return reply.status(400).send({ success: false, message: "Invalid Event ID." });
    }

    const collCollections = request.mongo.client.db(DB).collection(COLL_CONTRIBUTORS);
    const collExpenses = request.mongo.client.db(DB).collection(COLL_EXPENSES);
    const collEvents = request.mongo.client.db(DB).collection(COLL_EVENTS);

    const { username, roles } = request.user;
    const isAdmin = roles?.includes("admin");
    const isTreasurer = roles?.includes("treasurer");

    if (!isAdmin && !isTreasurer) {
      return reply.status(403).send({
        success: false,
        message: "You are not authorized.",
      });
    }

    // Validate if the treasurer is assigned to this event
    if (!isAdmin) {
      const event = await collEvents.findOne({
        _id: eventObjectId,
        "eventManagement.treasurers": username,
      });

      if (!event) {
        return reply.status(403).send({
          success: false,
          message: "You are not a treasurer for this event.",
        });
      }
    }

    const query = {
      eventId: eventObjectId,
      approved: false,
    };

    // Fetch pending collections and expenses in parallel
    const [pendingCollections, pendingExpenses] = await Promise.all([
      collCollections.find(query).toArray(),
      collExpenses.find(query).toArray(),
    ]);

    // Add `amountType` field for distinction
    const formattedCollections = pendingCollections.map((item) => ({
      ...item,
      amountType: "collection",
    }));

    const formattedExpenses = pendingExpenses.map((item) => ({
      ...item,
      amountType: "expense",
    }));

    return reply.status(200).send({
      success: true,
      data: [...formattedCollections, ...formattedExpenses],
    });
  } catch (err) {
    console.error("Error fetching pending amounts:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  CreateEventHandler,
  UpdateEventHandler,
  CreateExpenseHandler,
  UpdateExpenseHandler,
  GetEventHandler,
  AddCollectionHandler,
  ApproveAmountHandler,
  GetAllEventsHandler,
  GetAllCollectionHandler,
  GetAllExpensesHandler,
  GetAllPendingAmountHandler
};
