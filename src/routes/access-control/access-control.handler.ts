import { FastifyReply, FastifyRequest } from "fastify";
import { ObjectId } from "mongodb";
import { COLL_PERMISSIONS, COLL_ROLES } from "../../utils/constants";
import { CreatePermission, CreateRole } from "./access-control.schema";

const DB = process.env.DB_NAME || "";

// Create Role Handler
const CreateRoleHandler = async (
  request: FastifyRequest<CreateRole>,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user.roles?.indexOf("admin") === -1) {
      return reply.status(401).send({
        success: false,
        message: "You are not authorized to access!",
      });
    }

    const { name, permissions } = request.body;
    const collRoles = request.mongo.client.db(DB).collection(COLL_ROLES);

    if (!collRoles) {
      return reply.status(500).send({ success: false, message: "Internal server error" });
    }

    const objectIdPermissions = permissions.map((perm) => new ObjectId(perm));

    const result = await collRoles.findOneAndUpdate(
      { name },
      { $addToSet: { permissions: { $each: objectIdPermissions } } }, 
      { upsert: true, returnDocument: "after" } 
    );

    if (result?._id) {
      return reply.send({ success: true, data: result });
    } else {
      return reply.status(500).send({ success: false, message: "Error saving role" });
    }
  } catch (error) {
    console.error("Error:", error);
    return reply.status(500).send({ success: false, message: "Error saving role" });
  }
};

// Create Permission Handler
const CreatePermissionHandler = async (
  req: FastifyRequest<CreatePermission>,
  reply: FastifyReply
) => {
  try {
    if (!req.user || req.user.roles?.indexOf("admin") === -1) {
      return reply.status(401).send({
        success: false,
        message: `You are not authorized to create permissions, your current roles are ${req.user?.roles}.`,
      });
    }

    const collPermissions = req.mongo.client.db(DB).collection(COLL_PERMISSIONS);
    const { name, description } = req.body;

    if (!collPermissions) {
      return reply.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }

    const permission = await collPermissions.findOne({ name });
    if (permission) {
      return reply.status(409).send({
        success: false,
        message: "Permission already exists.",
      });
    }

    const result = await collPermissions.insertOne({ name, description });
    if (result.acknowledged) {
      return reply.send({
        success: true,
        data: result.insertedId, 
        message: "Permission created successfully",
      });
    } else {
      return reply.status(500).send({
        success: false,
        message: "Failed to create permission",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export { CreateRoleHandler, CreatePermissionHandler };
