import { FastifyReply, FastifyRequest } from "fastify";
import { COLL_CONTENT } from "../../utils/constants";
import { ObjectId } from "mongodb";
import { ContentBody } from "./content.schema";

const DB = process.env.DB_NAME || "";

const GetContentHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const collContent = request.mongo.client.db(DB).collection(COLL_CONTENT);

    if (!collContent) {
      return reply.status(500).send({ success: false, message: "Database error." });
    }

    const result = await collContent.find().toArray();

    return reply.status(200).send({
      success: true,
      data: result.length ? result : [],
    });
  } catch (err) {
    return reply.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const CreateContentHandler = async (
  request: FastifyRequest<{ Body: ContentBody }>,
  reply: FastifyReply
) => {
  try {
    const { _id, section, content } = request.body;
    const collContent = request.mongo.client.db(DB).collection(COLL_CONTENT);

    if (!collContent) {
      return reply.status(500).send({ success: false, message: "Database error." });
    }

    const newDoc = { _id: new ObjectId(_id), section, content };
    await collContent.insertOne(newDoc);

    return reply.status(201).send({
      success: true,
      message: "Content created successfully.",
      data: newDoc,
    });
  } catch (err) {
    return reply.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export interface UpdateContentBody{
    _id: string; section?: string; content?: object 
}
const UpdateContentHandler = async (
  request: FastifyRequest<{ Body: UpdateContentBody}>,
  reply: FastifyReply
) => {
  try {
    const { _id, section, content } = request.body;
    const collContent = request.mongo.client.db(DB).collection(COLL_CONTENT);

    if (!collContent) {
      return reply.status(500).send({ success: false, message: "Database error." });
    }

    const filter = { _id: new ObjectId(_id) };
    const updateData: { $set: Record<string, unknown> } = { $set: {} };

    if (section) updateData.$set.section = section;
    if (content) updateData.$set.content = content;

    const result = await collContent.updateOne(filter, updateData);

    if (result.matchedCount === 0) {
      return reply.status(404).send({ success: false, message: "Content not found." });
    }

    return reply.status(200).send({
      success: true,
      message: "Content updated successfully.",
    });
  } catch (err) {
    return reply.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export { GetContentHandler, CreateContentHandler, UpdateContentHandler };
